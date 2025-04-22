// answer_model.dart
// Contains StudentAnswer model and Result model

class StudentAnswer {
  final int id;
  final int studentId;
  final int questionId;
  final int? selectedOptionId;
  final String? textAnswer;
  final String submittedAt;

  StudentAnswer({
    required this.id,
    required this.studentId,
    required this.questionId,
    this.selectedOptionId,
    this.textAnswer,
    required this.submittedAt,
  });

  factory StudentAnswer.fromJson(Map<String, dynamic> json) {
    return StudentAnswer(
      id: json['id'],
      studentId: json['student'],
      questionId: json['question'],
      selectedOptionId: json['selected_option'],
      textAnswer: json['text_answer'],
      submittedAt: json['submitted_at'] ?? DateTime.now().toIso8601String(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'student': studentId,
        'question': questionId,
        if (selectedOptionId != null) 'selected_option': selectedOptionId,
        if (textAnswer != null) 'text_answer': textAnswer,
      };
}

class Result {
  final int id;
  final int quizId;
  final int studentId;
  final double score;
  final String completedAt;

  Result({
    required this.id,
    required this.quizId,
    required this.studentId,
    required this.score,
    required this.completedAt,
  });

  factory Result.fromJson(Map<String, dynamic> json) {
    return Result(
      id: json['id'],
      quizId: json['quiz'],
      studentId: json['student'],
      score: json['score'].toDouble(),
      completedAt: json['completed_at'],
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'quiz': quizId,
        'student': studentId,
        'score': score,
      };
}
