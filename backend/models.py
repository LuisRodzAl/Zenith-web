from datetime import datetime

class Emotion:
    EMOTIONS = [
        {"name": "Feliz", "emoji": "😊"},
        {"name": "Triste", "emoji": "😢"},
        {"name": "Enojado", "emoji": "😠"},
        {"name": "Ansioso", "emoji": "😟"},
        {"name": "Agradecido", "emoji": "🙏"},
        {"name": "Cansado", "emoji": "😴"},
        {"name": "Normal", "emoji": "😐"}
    ]

    @staticmethod
    def get_all():
        return Emotion.EMOTIONS

class Note:
    def __init__(self, user_id, title, content, emotion_name, emotion_emoji, timestamp=None):
        self.user_id = user_id
        self.title = title
        self.content = content
        self.emotion_name = emotion_name
        self.emotion_emoji = emotion_emoji
        self.timestamp = timestamp or datetime.now()

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'title': self.title,
            'content': self.content,
            'emotion_name': self.emotion_name,
            'emotion_emoji': self.emotion_emoji,
            'timestamp': self.timestamp
        }

class ChatMessage:
    def __init__(self, user_id, text, is_user_message, timestamp=None):
        self.user_id = user_id
        self.text = text
        self.is_user_message = is_user_message
        self.timestamp = timestamp or datetime.now()

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'text': self.text,
            'is_user_message': self.is_user_message,
            'timestamp': self.timestamp
        }

class Psicologo:
    def __init__(self, nombre, especialidad, telefono_celular, telefono_oficina, 
                 correo_electronico, direccion, ubicacion_url='', foto_url=''):
        self.nombre = nombre
        self.especialidad = especialidad
        self.telefono_celular = telefono_celular
        self.telefono_oficina = telefono_oficina
        self.correo_electronico = correo_electronico
        self.direccion = direccion
        self.ubicacion_url = ubicacion_url
        self.foto_url = foto_url

    def to_dict(self):
        return {
            'nombre': self.nombre,
            'especialidad': self.especialidad,
            'telefonoCelular': self.telefono_celular,
            'telefonoOficina': self.telefono_oficina,
            'correoElectronico': self.correo_electronico,
            'direccion': self.direccion,
            'ubicacionUrl': self.ubicacion_url,
            'fotoUrl': self.foto_url
        }

class Consejo:
    CONSEJOS = [
        {
            "texto": "La mayor riqueza es la salud mental. – Dalai Lama",
            "imagen": "https://cdn.pixabay.com/photo/2017/08/01/08/29/people-2563491_1280.jpg"
        },
        {
            "texto": "Acepta tus emociones sin juzgarte.",
            "imagen": "https://revistapersonae.com/wp-content/uploads/2023/10/Galeria_287_Psicologia_02.jpg"
        },
        {
            "texto": "Un mal día no define quién eres.",
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7-R04TVOlEhq4Rv34t1imHtE0649Tl86QuNCpeH_4i1amIFdUbhALRQTww1QTgW4sBLc&usqp=CAU"
        },
        {
            "texto": "Haz una cosa a la vez. Está bien ir lento.",
            "imagen": "https://olacoach.com/wp-content/uploads/2024/01/persevere-s-960x540-1.jpeg"
        },
        {
            "texto": "Está bien pedir ayuda. No tienes que enfrentarlo todo solo.",
            "imagen": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhibBB-JcAIElLijvzNbnM4NAtwVQAdArXyBYqiLnV1yihRduQ4jgWUlrpNwAczkFuw-YeMVNDz2y30olxXAEBYMbO93sdutiAtmJrRF8MUkofUDVI537xdRWv8pQq9Ma4H5pErdKf1BmDj/s400/160114+Necesito+ayuda.jpg"
        },
        {
            "texto": "Cada día es una oportunidad para crecer",
            "imagen": "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800"
        },
        {
            "texto": "La paz comienza con una sonrisa",
            "imagen": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
        },
        {
            "texto": "Respira profundo, todo estará bien",
            "imagen": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800"
        },
        {
            "texto": "Eres más fuerte de lo que piensas",
            "imagen": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800"
        },
        {
            "texto": "Cultiva pensamientos positivos",
            "imagen": "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800"
        }
    ]

    @staticmethod
    def get_all():
        return Consejo.CONSEJOS
