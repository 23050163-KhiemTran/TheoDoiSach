# backend/utils/security.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str):
    # encode UTF-8, cắt tối đa 72 bytes
    pw_bytes = password.encode("utf-8")[:72]
    return pwd_context.hash(pw_bytes)

def verify_password(password: str, hashed: str):
    pw_bytes = password.encode("utf-8")[:72]
    return pwd_context.verify(pw_bytes, hashed)

