import 'package:flutter/material.dart';
import 'quiz_card.dart';
import 'your_quiz_item.dart';
import 'custom_app_bar.dart';
import 'home3.dart';

// Import the CustomAppBar

class QuizHomePage2 extends StatelessWidget {
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
                margin: EdgeInsets.only(
                  left: screenWidth * 0.02,
                ), // 2% of screen width
                child: Text(
                  'Upcoming Quizzes',
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
              // Quiz Cards
              QuizCard(
                category: "General Knowledge",
                time: "2min",
                title: "Saturday night Quiz",
                quizzes: 13,
                sharedBy: "Brandon Matrovs",
                
              ),
              SizedBox(height: screenHeight * 0.02), // 2% of screen height
              QuizCard(
                category: "General Knowledge",
                time: "2min",
                title: "Saturday night Quiz",
                quizzes: 13,
                sharedBy: "Brandon Matrovs",
                
              ),
              SizedBox(height: screenHeight * 0.02), // 2% of screen height
              QuizCard(
                category: "General Knowledge",
                time: "2min",
                title: "Saturday night Quiz",
                quizzes: 13,
                sharedBy: "Brandon Matrovs",
                
              ),
              SizedBox(height: screenHeight * 0.03), // 3% of screen height
              // Your Quizzes and See all button in the same line
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "Your Quizzes",
                    style: TextStyle(
                      color: Color(0xFF0C092A),
                      fontFamily: 'Georgia',
                      fontSize: screenWidth * 0.045, // 4.5% of screen width
                      fontStyle: FontStyle.normal,
                      fontWeight: FontWeight.w700,
                      height: 1.0,
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => QuizHomePage3(),
                        ),
                      );
                    },
                    child: ShaderMask(
                      shaderCallback: (Rect bounds) {
                        return LinearGradient(
                          colors: [Color(0xFF28A9D7), Color(0xFF0664AE)],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ).createShader(bounds);
                      },
                      child: Text(
                        "See all",
                        style: TextStyle(
                          fontFamily: 'Georgia',
                          fontSize: screenWidth * 0.04, // 4% of screen width
                          fontStyle: FontStyle.normal,
                          fontWeight: FontWeight.w700,
                          height: 1.5,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),

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
                  ),
                  SizedBox(height: screenHeight * 0.02), // 2% of screen height
                  YourQuizItem(
                    title: "General Knowledge",
                    quizzes: 6,
                    participants: 437,
                    imagePath: 'assets/img/homeimg/Frame.png',
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
