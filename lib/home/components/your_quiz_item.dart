import 'package:flutter/material.dart';



class YourQuizItem extends StatelessWidget {
  final String title;
  final int quizzes;
  final int participants;
  final String imagePath;
  final VoidCallback? onTap; // Callback for tap event

  const YourQuizItem({
    Key? key,
    required this.title,
    required this.quizzes,
    required this.participants,
    required this.imagePath,
    this.onTap, // Optional onTap callback
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Get screen dimensions
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    return GestureDetector(
      onTap: onTap, // Trigger the onTap callback when the card is tapped
      child: Container(
        padding: EdgeInsets.all(screenWidth * 0.03), // Responsive padding (3% of screen width)
        decoration: BoxDecoration(
          color: Color(0xFFF3F3F3),
          borderRadius: BorderRadius.circular(screenWidth * 0.04), // Responsive border radius (4% of screen width)
        ),
        child: Column(
          children: [
            // White box with quiz details
            Card(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(screenWidth * 0.04), // Responsive border radius
              ),
              elevation: 0, // No shadow for the inner white box
              color: Colors.white, // White background for the inner box
              child: Padding(
                padding: EdgeInsets.fromLTRB(
                  screenWidth * 0.02, // Left padding (2% of screen width)
                  screenWidth * 0.02, // Top padding (2% of screen width)
                  screenWidth * 0.03, // Right padding (3% of screen width)
                  screenWidth * 0.02, // Bottom padding (2% of screen width)
                ),
                child: Row(
                  children: [
                    // Quiz icon image
                    Image.asset(
                      imagePath, // Path to the quiz icon image
                      width: screenWidth * 0.12, // Responsive width (12% of screen width)
                      height: screenWidth * 0.12, // Responsive height (12% of screen width)
                      fit: BoxFit.cover,
                    ),
                    SizedBox(width: screenWidth * 0.03), // Responsive spacing (3% of screen width)
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: TextStyle(
                              color: Color(0xFF3D3D3D),
                              fontFamily: 'Georgia',
                              fontSize: screenWidth * 0.04, // Responsive font size (4% of screen width)
                              fontStyle: FontStyle.normal,
                              fontWeight: FontWeight.w700,
                              height: 1.0,
                            ),
                          ),
                          SizedBox(height: screenHeight * 0.01), // Responsive spacing (1% of screen height)
                          Text(
                            "$quizzes Quizzes",
                            style: TextStyle(
                              color: Color(0xFF6D6D6D),
                              fontFamily: 'Georgia',
                              fontSize: screenWidth * 0.03, // Responsive font size (3% of screen width)
                              fontStyle: FontStyle.normal,
                              fontWeight: FontWeight.w400,
                              height: 1.0,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Result button as an image
                    IconButton(
                      onPressed: () {
                        print("Result button pressed");
                      },
                      icon: Image.asset(
                        "assets/img/homeimg/Frame 33.png",
                        width: screenWidth * 0.22, // Responsive width (22% of screen width)
                        height: screenWidth * 0.06, // Responsive height (6% of screen width)
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: screenHeight * 0.01), // Responsive spacing (1% of screen height)
            // Text under the white box but inside the grey box
            Align(
              alignment: Alignment.centerLeft,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Image.asset(
                    "assets/img/homeimg/Group 128.png",
                    width: screenWidth * 0.25, // Responsive width (25% of screen width)
                    height: screenWidth * 0.1, // Responsive height (10% of screen width)
                  ),
                  SizedBox(width: screenWidth * 0.01), // Responsive spacing (1% of screen width)
                  Text(
                    "+$participants People joined",
                    style: TextStyle(
                      color: Color(0xFF858494),
                      fontFamily: 'Georgia',
                      fontSize: screenWidth * 0.035, // Responsive font size (3.5% of screen width)
                      fontStyle: FontStyle.normal,
                      fontWeight: FontWeight.w400,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}