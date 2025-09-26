from typing import Optional, Tuple
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
import jwt


class FirebaseHeaderAuthentication(BaseAuthentication):
    """
    Dev-friendly auth that accepts Firebase ID token via X-Firebase-Auth header.
    For production, verify with Firebase Admin SDK and validate audience/issuer.
    """

    keyword = 'X-Firebase-Auth'

    def authenticate(self, request) -> Optional[Tuple[object, None]]:
        id_token = request.headers.get(self.keyword)
        if not id_token:
            return None

        try:
            # Decode without verification for local dev only
            payload = jwt.decode(id_token, options={"verify_signature": False})
        except Exception as exc:
            raise exceptions.AuthenticationFailed(f"Invalid Firebase token: {exc}")

        firebase_uid = payload.get('sub')
        email = payload.get('email')
        if not (firebase_uid or email):
            raise exceptions.AuthenticationFailed("Firebase token missing sub/email")

        User = get_user_model()
        user = None
        if email:
            user = User.objects.filter(email=email).first()
        if not user and firebase_uid:
            # fall back to username mapping to uid
            user = User.objects.filter(username=firebase_uid).first()

        if not user:
            # create a local user for convenience in dev
            username = (email or firebase_uid or 'user').split('@')[0]
            user = User.objects.create_user(username=username, email=email or '')

        return user, None


