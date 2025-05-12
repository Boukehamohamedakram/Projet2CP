from django.apps import AppConfig


class QuizConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Quiz'

    def ready(self):
        import Quiz.signals  # Import the signals to connect them
