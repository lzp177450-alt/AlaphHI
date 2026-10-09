# DeepSeek V4 tokenizer 本地测试脚本
# 运行: C:\Users\13809\Downloads\deepseek_v4_tokenizer\.venv\Scripts\python.exe test_tokenizer.py
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")

import transformers
from tokenizers import Tokenizer  # 原生后端, 用于交叉验证

HERE = os.path.dirname(os.path.abspath(__file__))
REPORT = os.path.join(HERE, "运行结果.txt")

lines = []


def log(text=""):
    print(text)
    lines.append(text)


tokenizer = transformers.AutoTokenizer.from_pretrained(HERE, trust_remote_code=True)
raw = Tokenizer.from_file(os.path.join(HERE, "tokenizer.json"))

log(f"transformers 版本: {transformers.__version__}")
log(f"tokenizer 类型:    {type(tokenizer).__name__} (is_fast={tokenizer.is_fast})")
log(f"词表大小:          {tokenizer.vocab_size} (+{len(tokenizer) - tokenizer.vocab_size} 个 added tokens)")
log(f"bos={tokenizer.bos_token!r}  eos={tokenizer.eos_token!r}  pad={tokenizer.pad_token!r}")

samples = [
    "Hello!",
    "你好，世界！",
    "DeepSeek V4 tokenizer test 🚀",
]

all_ok = True
for text in samples:
    ids = tokenizer.encode(text)  # 默认编码方式
    back = tokenizer.decode(ids)
    ids_ns = tokenizer.encode(text, add_special_tokens=False)
    raw_ids = raw.encode(text, add_special_tokens=False).ids
    ok = (back == text) and (ids_ns == raw_ids)
    all_ok = all_ok and ok
    log()
    log(f"文本:  {text!r}")
    log(f"ids:   {ids}")
    log(f"还原:  {back!r}")
    log(f"结果:  {'通过' if ok else '失败 (与原生后端不一致!)'}")

messages = [
    {"role": "user", "content": "Hi"},
    {"role": "assistant", "content": "Hello!"},
]
rendered = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
log()
log("chat template 渲染示例:")
log(rendered)
log()
log("=== 全部通过 ===" if all_ok else "=== 存在失败项! ===")

with open(REPORT, "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")
print(f"\n结果已保存: {REPORT}")

sys.exit(0 if all_ok else 1)
