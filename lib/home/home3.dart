import 'package:flutter/material.dart';
import 'your_quiz_item.dart';
import 'custom_app_bar.dart';
import 'home4.dart';

// Import the CustomAppBar

class QuizHomePage3 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Get screen size
    final double screenWidth = MediaQuery.of(context).size.width;
    final double screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: CustomAppBar(
        username: "Boukeha Akram",
        profilePicture: "assets/img/homeimg/Avatar.png",
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(screenWidth * 0.04), // 4% of screen width
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Container with "Upcoming Quizzes" text
              Container(
                alignment: Alignment.centerLeft,

                child: Text(
                  'Your Quizzes',
                  style: TextStyle(
                    color: Color(0xFF000000), // Hex color #000
                    fontFamily: 'Georgia', // Font family
                    fontSize: screenWidth * 0.06, // 6% of screen width
                    fontStyle: FontStyle.normal, // Font style
                    fontWeight: FontWeight.w700, // Font weight (700 = bold)
                    height: 1.0, // Line height (normal)
                  ),
                ),
              ),
              SizedBox(height: screenHeight * 0.02), // 2% of screen height
              // List of Your Quizzes
              ListView(
                shrinkWrap:
                    true, // Use shrinkWrap to make the ListView take only the space it needs
                physics:
                    NeverScrollableScrollPhysics(), // Disable scrolling of the inner ListView
                children: [
                  YourQuizItem(
                    title: "Integers Quiz",
                    quizzes: 10,
                    participants: 437,
                    imagePath: 'assets/img/homeimg/Frame.png',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder:
                              (context) =>
                                  QuizHomePage4(), // Replace with your target page
                        ),
                      );
                    },
                  ),
                  SizedBox(height: screenHeight * 0.02), // 2% of screen height
                  YourQuizItem(
                    title: "General Knowledge",
                    quizzes: 6,
                    participants: 437,
                    imagePath: 'assets/img/homeimg/Frame.png',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder:
                              (context) =>
                                  QuizHomePage4(), // Replace with your target page
                        ),
                      );
                    },
                  ),
                  SizedBox(height: screenHeight * 0.02), // 2% of screen height
                  YourQuizItem(
                    title: "General Knowledge",
                    quizzes: 6,
                    participants: 437,
                    imagePath: 'assets/img/homeimg/Frame.png',
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder:
                              (context) =>
                                  QuizHomePage4(), // Replace with your target page
                        ),
                      );
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
