import 'package:flutter/material.dart';
import 'dart:ui';
import 'components/quizcard4.dart'; // Import the QuizCard class
import 'components/your_quiz_item.dart';

class QuizHomePage4 extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Get the screen size
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(screenHeight * 0.15), // Adjust height as needed
        child: Container(
          margin: EdgeInsets.only(top: screenHeight * 0.02), // Add top margin
          child: CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: screenHeight * 0.15, // Height of the expanded app bar
                floating: false,
                pinned: true,
                snap: false,
                flexibleSpace: FlexibleSpaceBar(
                  title: Padding(
                    padding: EdgeInsets.only(
                      left: screenWidth * 0.05,
                      bottom: screenHeight * 0.02,
                    ), // Adjust padding
                    child: Text(
                      'Your Quizzes',
                      style: TextStyle(
                        color: Color(0xFF0C092A),
                        fontFamily: 'Georgia',
                        fontSize: screenWidth * 0.06, // Responsive font size
                        fontStyle: FontStyle.normal,
                        fontWeight: FontWeight.bold,
                        height: 1.0,
                      ),
                    ),
                  ),
                  background: Container(
                    color: Colors.white, // Background color when expanded
                  ),
                ),
                backgroundColor: Colors.transparent, // Make AppBar transparent when collapsed
                elevation: 0, // Remove shadow
                automaticallyImplyLeading: false,
              ),
            ],
          ),
        ),
      ),

      body: Column(
  children: [
    Stack(
      children: [
        // Blurry YourQuizItem
        YourQuizItem(
          title: "General Knowledge",
          quizzes: 6,
          participants: 437,
          imagePath: 'assets/img/Frame.png',
        ),

        BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 4, sigmaY: 4),
          child: Container(
            color: Colors.transparent, // Background color when expanded
          ),
        ),
      ],
    ),
    SizedBox(height: screenHeight * 0.02), // Responsive spacing
    
    // QuizCard4 without any blur effect
    QuizCard4(
      title: "General Knowledge",
      quizzes: 6,
      date: "29-11-2025",
      time: "2min",
      section: "Section B",
      sharedBy: "Brandon Matrows",
      imagePath: "assets/img/Frame.png",
      grad: "5/15",
    ),
  ],
),
    );
  }
}