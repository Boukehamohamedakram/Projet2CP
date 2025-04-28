// quiz_model.dart
// Contains the Quiz model and related classes

import 'question_model.dart';

class Quiz {
  final int id;
  final String title;
  final String description;
  final int teacherId;
  final int timeLimit;
  final bool isPublished;
  final String? startTime;
  final String? endTime;
  final String category;
  final List<Question>? questions;
  final List<int>? assignedStudents;

  Quiz({
    required this.id,
    required this.title,
    required this.description,
    required this.teacherId,
    required this.timeLimit,
    required this.isPublished,
    this.startTime,
    this.endTime,
    required this.category,
    this.questions,
    this.assignedStudents,
  });

  factory Quiz.fromJson(Map<String, dynamic> json) {
    List<Question>? questionsList;
    if (json['questions'] != null) {
      questionsList = List<Question>.from(
          json['questions'].map((q) => Question.fromJson(q)));
    }

    List<int>? studentsList;
    if (json['assigned_students'] != null) {
      studentsList = List<int>.from(json['assigned_students']);
    }

    return Quiz(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      teacherId: json['teacher'],
      timeLimit: json['time_limit'],
      isPublished: json['is_published'],
      startTime: json['start_time'],
      endTime: json['end_time'],
      category: json['category'],
      questions: questionsList,
      assignedStudents: studentsList,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'description': description,
        'teacher': teacherId,
        'time_limit': timeLimit,
        'is_published': isPublished,
        if (startTime != null) 'start_time': startTime,
        if (endTime != null) 'end_time': endTime,
        'category': category,
        if (assignedStudents != null) 'assigned_students': assignedStudents,
      };
}
