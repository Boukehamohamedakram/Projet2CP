import 'package:flutter/material.dart';

class QuizCard4 extends StatelessWidget {
  final String title;
  final int quizzes;
  final String grad;
  final String date;
  final String time;
  final String section;
  final String sharedBy;
  final String imagePath;

  QuizCard4({
    required this.title,
    required this.quizzes,
    required this.grad,
    required this.date,
    required this.time,
    required this.section,
    required this.sharedBy,
    required this.imagePath,
  });

  @override
  Widget build(BuildContext context) {
    final double screenWidth = MediaQuery.of(context).size.width;
    final double screenHeight = MediaQuery.of(context).size.height;

    return Center(
      child: Container(
        width: screenWidth * 0.9, // Card width is 90% of the screen width
        padding: EdgeInsets.all(screenWidth * 0.04), // 4% of screen width
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(
            screenWidth * 0.03,
          ), // 3% of screen width
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.3),
              spreadRadius: 2,
              blurRadius: 8,
              offset: Offset(0, 4), // Shadow position
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Quiz title and number of quizzes
            Card(
              elevation: 0, // No shadow for the inner white box
              color: Colors.white, // White background for the inner box
              child: Row(
                children: [
                  // Quiz icon image
                  Image.asset(
                    imagePath, // Path to the quiz icon image
                    width: screenWidth * 0.15, // 12% of screen width
                    height: screenWidth * 0.15, // 12% of screen width
                    fit: BoxFit.cover,
                  ),
                  SizedBox(width: screenWidth * 0.03), // 3% of screen width
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: TextStyle(
                            color: Color(0xFF3D3D3D),
                            fontFamily: 'Georgia',
                            fontSize: screenWidth * 0.04, // 4% of screen width
                            fontStyle: FontStyle.normal,
                            fontWeight: FontWeight.w700,
                            height: 1.0,
                          ),
                        ),
                        SizedBox(
                          height: screenHeight * 0.01,
                        ), // 1% of screen height
                        Text(
                          "$quizzes Quizzes",
                          style: TextStyle(
                            color: Color(0xFF6D6D6D),
                            fontFamily: 'Georgia',
                            fontSize: screenWidth * 0.03, // 3% of screen width
                            fontStyle: FontStyle.normal,
                            fontWeight: FontWeight.w400,
                            height: 1.0,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Grad and image (no space between them)
                  Image.asset(
                    "assets/img/homeimg/Icon.png",
                    width: screenWidth * 0.1, // 10% of screen width
                    height: screenWidth * 0.07, // 6% of screen width
                    fit: BoxFit.contain,
                  ),
                  ShaderMask(
                    shaderCallback: (Rect bounds) {
                      return LinearGradient(
                        colors: [Color(0xFF31BCE2), Color(0xFF0664AE)],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ).createShader(bounds);
                    },
                    child: Text(
                      "$grad",
                      style: TextStyle(
                        color:
                            Colors
                                .white, // Text color is white for better contrast
                        fontFamily: 'Georgia',
                        fontSize: screenWidth * 0.04, // 3% of screen width
                        fontStyle: FontStyle.normal,
                        fontWeight: FontWeight.w400,
                        height: 1.0,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(height: screenHeight * 0.02), // 2% of screen height
            // Date container
            Container(
              padding: EdgeInsets.symmetric(
                horizontal: screenWidth * 0.04, // 3% of screen width
                vertical: screenHeight * 0.005, // 1% of screen height
              ),
              decoration: BoxDecoration(
                color: Colors.white, // Background color (#FFF)
                borderRadius: BorderRadius.circular(
                  screenWidth * 0.1,
                ), // 10% of screen width
                border: Border.all(
                  color: Color(0xFFEFEEFC), // Border color (#EFEEFC)
                  width: 1, // Border width (1px)
                ),
              ),
              child: Text(
                date, // Your text here
                style: TextStyle(
                  color: Color(0xFF3D3D3D), // Text color (#3D3D3D)
                  fontFamily: 'Georgia', // Font family (Georgia)
                  fontSize: screenWidth * 0.035, // 3.5% of screen width
                  fontStyle: FontStyle.normal, // Font style (normal)
                  fontWeight: FontWeight.w400, // Font weight (400)
                ),
              ),
            ),

            SizedBox(height: screenHeight * 0.01), // 2% of screen height
            // Time and Consult button
            Row(
              children: [
                // Time container
                Container(
                  padding: EdgeInsets.symmetric(
                    horizontal: screenWidth * 0.04, // 3% of screen width
                    vertical: screenHeight * 0.005, // 1% of screen height
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white, // Background color (#FFF)
                    borderRadius: BorderRadius.circular(
                      screenWidth * 0.1,
                    ), // 10% of screen width
                    border: Border.all(
                      color: Color(0xFFEFEEFC), // Border color (#EFEEFC)
                      width: 1, // Border width (1px)
                    ),
                  ),
                  child: Text(
                    time, // Your text here
                    style: TextStyle(
                      color: Color(0xFF3D3D3D), // Text color (#3D3D3D)
                      fontFamily: 'Georgia', // Font family (Georgia)
                      fontSize: screenWidth * 0.035, // 3.5% of screen width
                      fontStyle: FontStyle.normal, // Font style (normal)
                      fontWeight: FontWeight.w400, // Font weight (400)
                    ),
                  ),
                ),
                SizedBox(width: screenWidth * 0.15), // 2% of screen width
                // Consult button
                ElevatedButton(
                  onPressed: () {
                    // Add your onPressed logic here
                  },
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(
                      horizontal: 12, // 12px horizontal padding
                      vertical: 6, // 6px vertical padding
                    ),
                    minimumSize: Size(88, 37), // Width: 88px, Height: 37px
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(
                        38,
                      ), // Border radius (38px)
                      side: BorderSide(
                        color: Color(0xFF31BCE2), // Border color (#31BCE2)
                        width: 1, // Border width (1px)
                      ),
                    ),
                    backgroundColor:
                        Colors.transparent, // Transparent background
                    elevation: 0, // No shadow
                  ),
                  child: ShaderMask(
                    shaderCallback: (Rect bounds) {
                      return LinearGradient(
                        colors: [
                          Color.fromARGB(255, 199, 226, 49), // Start color of the gradient
                          Color(0xFF0664AE), // End color of the gradient
                        ],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ).createShader(bounds);
                    },
                    child: Text(
                      "Consult",
                      textAlign: TextAlign.center, // Center align text
                      style: TextStyle(
                        fontFamily: 'Georgia', // Font family (Georgia)
                        fontSize: 16, // Font size (16px)
                        fontStyle: FontStyle.normal, // Font style (normal)
                        fontWeight: FontWeight.w700, // Font weight (700)
                        height: 1.25, // Line height (125%)
                        letterSpacing: -0.08, // Letter spacing (-0.08px)
                      ),
                    ),
                  ),
                ),
              ],
            ),

            SizedBox(height: screenHeight * 0.01), // 2% of screen height
            // Section container
            Container(
              padding: EdgeInsets.symmetric(
                horizontal: screenWidth * 0.04, // 3% of screen width
                vertical: screenHeight * 0.005, // 1% of screen height
              ),
              decoration: BoxDecoration(
                color: Colors.white, // Background color (#FFF)
                borderRadius: BorderRadius.circular(
                  screenWidth * 0.1,
                ), // 10% of screen width
                border: Border.all(
                  color: Color(0xFFEFEEFC), // Border color (#EFEEFC)
                  width: 1, // Border width (1px)
                ),
              ),
              child: Text(
                section, // Your text here
                style: TextStyle(
                  color: Color(0xFF3D3D3D), // Text color (#3D3D3D)
                  fontFamily: 'Georgia', // Font family (Georgia)
                  fontSize: screenWidth * 0.035, // 3.5% of screen width
                  fontStyle: FontStyle.normal, // Font style (normal)
                  fontWeight: FontWeight.w400, // Font weight (400)
                ),
              ),
            ),

            SizedBox(height: screenHeight * 0.02), // 2% of screen height
            // Shared by section
            Row(
              children: [
                CircleAvatar(
                  radius: screenWidth * 0.05, // 5% of screen width
                  backgroundImage: AssetImage('assets/profile_picture.png'),
                ),
                SizedBox(width: screenWidth * 0.02), // 2% of screen width
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Shared by",
                      style: TextStyle(
                        color: Color(0xFF252525),
                        fontFamily: 'Georgia',
                        fontSize: screenWidth * 0.035, // 3.5% of screen width
                        fontWeight: FontWeight.w400,
                        height: 1.5,
                      ),
                    ),
                    Text(
                      sharedBy,
                      style: TextStyle(
                        color: Color(0xFF252525),
                        fontFamily: 'Georgia',
                        fontSize: screenWidth * 0.035, // 3.5% of screen width
                        fontWeight: FontWeight.w400,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
                Spacer(),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
