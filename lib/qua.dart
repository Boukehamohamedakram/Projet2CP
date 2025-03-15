import 'package:flutter/material.dart';
import 'dart:async';

class QuizPage extends StatefulWidget {
  final String title;
  final int time;
  final int numberOfQuestions;
  final double grade;
  final List<Map<String, dynamic>> answers;

  QuizPage({
    required this.title,
    required this.time,
    required this.numberOfQuestions,
    required this.grade,
    required this.answers,
  });

  @override
  _QuizPageState createState() => _QuizPageState();
}

class _QuizPageState extends State<QuizPage> {
  int currentQuestion = 0;
  int selectedAnswer = -1;
  double score = 0;
  late int timer;
  Timer? countdownTimer;

  @override
  void initState() {
    super.initState();
    timer = widget.time;
    startTimer();
  }

  void startTimer() {
    countdownTimer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        if (this.timer > 0) {
          this.timer--;
        } else {
          timer.cancel();
        }
      });
    });
  }

  @override
  void dispose() {
    countdownTimer?.cancel();
    super.dispose();
  }

  void handleAnswerSelect(int index) {
    setState(() {
      selectedAnswer = index;
      if (widget.answers[currentQuestion]['correctAnswer'] == index) {
        score += widget.grade / widget.numberOfQuestions;
      }
    });
  }

  void handleNext() {
    setState(() {
      if (currentQuestion < widget.numberOfQuestions - 1) {
        selectedAnswer = -1;
        currentQuestion++;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Center(
              child: Text('$timer s', style: TextStyle(fontSize: 18)),
            ),
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.answers[currentQuestion]['question'],
                style: TextStyle(fontSize: 20)),
            SizedBox(height: 20),
            Column(
              children: List.generate(widget.answers[currentQuestion]['options'].length, (index) {
                return GestureDetector(
                  onTap: () => handleAnswerSelect(index),
                  child: Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(12),
                    margin: EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: selectedAnswer == index
                          ? widget.answers[currentQuestion]['correctAnswer'] == index
                              ? Colors.green
                              : Colors.red
                          : Colors.grey[300],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(widget.answers[currentQuestion]['options'][index],
                        style: TextStyle(fontSize: 18)),
                  ),
                );
              }),
            ),
            SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Score: ${score.toStringAsFixed(1)} / ${widget.grade}',
                    style: TextStyle(fontSize: 16)),
                if (currentQuestion < widget.numberOfQuestions - 1)
                  ElevatedButton(
                    onPressed: handleNext,
                    child: Text('Next'),
                  ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
