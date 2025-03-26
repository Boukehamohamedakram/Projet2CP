import 'package:flutter/material.dart';

class QuizCard extends StatelessWidget {
  final String category;
  final String time;
  final String title;
  final int quizzes;
  final String sharedBy;
  final VoidCallback? onTap; // Add a callback for tap events

  const QuizCard({
    Key? key,
    required this.category,
    required this.time,
    required this.title,
    required this.quizzes,
    required this.sharedBy,
   this.onTap, // Initialize the callback
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Get screen size
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    return GestureDetector(
      onTap: onTap, // Trigger the callback when tapped
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16), // Match the card's border radius
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1), // Shadow color
              spreadRadius: 2, // How far the shadow spreads
              blurRadius: 8, // How blurry the shadow is
              offset: Offset(0, 4), // Shadow offset (x, y)
            ),
          ],
        ),
        child: Card(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(
              color: Color(0xFFEFEEFC), // Border color
              width: 1, // Border width
            ),
          ),
          elevation: 0, // No shadow for the card itself
          color: Color(0xFFFFFFFF), // Background color
          child: Padding(
            padding: EdgeInsets.all(screenWidth * 0.04), // Responsive padding
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    // Category Chip
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: screenWidth * 0.03, // Responsive padding
                        vertical: screenHeight * 0.01,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(50),
                        border: Border.all(color: Color(0xFFEFEEFC), width: 1),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            category,
                            style: TextStyle(
                              color: Color(0xFFF2B91E),
                              fontFamily: 'Georgia',
                              fontSize: screenWidth * 0.04, // Responsive font size
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          SizedBox(width: screenWidth * 0.02), // Responsive gap
                        ],
                      ),
                    ),
                    SizedBox(width: screenWidth * 0.02), // Responsive gap
                    // Time Chip
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: screenWidth * 0.03,
                        vertical: screenHeight * 0.01,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(50),
                        border: Border.all(color: Color(0xFFEFEEFC), width: 1),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.access_time,
                            color: Colors.black,
                            size: screenWidth * 0.04, // Responsive icon size
                          ),
                          SizedBox(width: screenWidth * 0.02), // Responsive gap
                          Text(
                            time,
                            style: TextStyle(
                              color: Color(0xFF252525),
                              fontFamily: 'Georgia',
                              fontSize: screenWidth * 0.04, // Responsive font size
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                SizedBox(height: screenHeight * 0.02), // Responsive gap
                // Title
                Text(
                  title,
                  style: TextStyle(
                    color: Color(0xFF252525),
                    fontFamily: 'Georgia',
                    fontSize: screenWidth * 0.06, // Responsive font size
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: screenHeight * 0.01), // Responsive gap
                // Quizzes Count
                Text(
                  "$quizzes Quizzes",
                  style: TextStyle(
                    color: Color(0xFF252525),
                    fontFamily: 'Georgia',
                    fontSize: screenWidth * 0.035, // Responsive font size
                    fontWeight: FontWeight.w400,
                    height: 1.5,
                  ),
                ),
                SizedBox(height: screenHeight * 0.02), // Responsive gap
                // Shared By Section
                Row(
                  children: [
                    CircleAvatar(
                      radius: screenWidth * 0.05, // Responsive avatar size
                      backgroundImage: AssetImage('assets/profile_picture.png'),
                    ),
                    SizedBox(width: screenWidth * 0.02), // Responsive gap
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Shared by",
                          style: TextStyle(
                            color: Color(0xFF252525),
                            fontFamily: 'Georgia',
                            fontSize: screenWidth * 0.035, // Responsive font size
                            fontWeight: FontWeight.w400,
                            height: 1.5,
                          ),
                        ),
                        Text(
                          sharedBy,
                          style: TextStyle(
                            color: Color(0xFF252525),
                            fontFamily: 'Georgia',
                            fontSize: screenWidth * 0.035, // Responsive font size
                            fontWeight: FontWeight.w400,
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                    Spacer(),
                    // Start Now Button
                    ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(48),
                        ),
                        backgroundColor: Colors.transparent,
                        shadowColor: Colors.transparent,
                      ),
                      child: Ink(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Color(0xFF31BCE2), Color(0xFF0664AE)],
                          ),
                          borderRadius: BorderRadius.circular(48), // Corrected property
                        ),
                        child: Container(
                          alignment: Alignment.center,
                          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          child: Text(
                            "Start Now",
                            style: TextStyle(
                              color: Color(0xFFFFFFFF),
                              fontFamily: 'Georgia',
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}