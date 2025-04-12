import 'package:flutter/material.dart';
import 'components/quiz_card.dart';
import 'components/your_quiz_item.dart';
import 'components/custom_app_bar.dart';
import 'home2.dart';
import 'home3.dart'; // Import the CustomAppBar

class QuizHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Get screen size
    final double screenWidth = MediaQuery.of(context).size.width;
    final double screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      
      
    backgroundColor: Colors.white,
      appBar: CustomAppBar(
        username: "Boukeha Akram",
        profilePicture: "assets/img/Avatar.png",
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

                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder:
                          (context) =>
                              QuizHomePage2(), // Replace with your target page
                    ),
                  );
                },
              ),

              Align(
                alignment: Alignment.center, // Move the column to the right
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    // First box
                    Container(
                      width: screenWidth * 0.83, // 80% of screen width
                      height: screenHeight * 0.02, // 4% of screen height
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.only(
                          bottomLeft: Radius.circular(
                            10,
                          ), // Apply radius to bottom left corner
                          bottomRight: Radius.circular(
                            10,
                          ), // Apply radius to bottom right corner
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.5),
                            spreadRadius: 2,
                            blurRadius: 5,
                            offset: Offset(
                              0,
                              3,
                            ), // Positive y offset moves shadow down, removing top shadow
                          ),
                        ],
                      ),
                    ),
                    // Second box
                    Container(
                      width: screenWidth * 0.8, // 70% of screen width
                      height: screenHeight * 0.02, // 4% of screen height
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.only(
                          bottomLeft: Radius.circular(
                            10,
                          ), // Apply radius to bottom left corner
                          bottomRight: Radius.circular(
                            10,
                          ), // Apply radius to bottom right corner
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.5),
                            spreadRadius: 2,
                            blurRadius: 5,
                            offset: Offset(0, 3), // Shadow position
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
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
                    imagePath: 'assets/img/Frame.png',
                  ),
                  SizedBox(height: screenHeight * 0.02), // 2% of screen height
                  YourQuizItem(
                    title: "General Knowledge",
                    quizzes: 6,
                    participants: 437,
                    imagePath: 'assets/img/Frame.png',
                  ),
                  SizedBox(height: screenHeight * 0.02), // 2% of screen height
                  YourQuizItem(
                    title: "General Knowledge",
                    quizzes: 6,
                    participants: 437,
                    imagePath: 'assets/img/Frame.png',
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
