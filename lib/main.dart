import 'package:flutter/material.dart';
 // Import the settings page
 
import 'home/home1.dart'; 



void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: MainPage(), // Start at MainPage
    );
  }
}

class MainPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Main Page'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) =>  QuizHomePage()), // Navigate to SettingsPage
            );
          },
          child: Text('Go to Settings'),
        ),
      ),
    );
  }
}
