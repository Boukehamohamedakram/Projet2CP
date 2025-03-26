// main.dart
import 'package:flutter/material.dart';
import 'consult/components/appbar.dart';
import 'home/home1.dart'; // Ensure this path is correct

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: MainPage(),
    );
  }
}

class MainPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Main Page')),
      body: Center(
        child: ElevatedButton(
          onPressed: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (context) =>  QuizHomePage()),
          ),
          child: const Text('Start Quiz'),
        ),
      ),
    );
  }
}

class QuizPage extends StatelessWidget {
  const QuizPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(180),
        child: CustomAppBar(
          titel: "Saturday Night Quiz",
          num: 10,  // Total questions
          qnum: 2,  // Current question number
        ),
      ),
      body: const Center(
        child: Text('Quiz Content Goes Here'),
      ),
    );
  }
}