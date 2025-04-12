import 'package:flutter/material.dart';

class QuizCard extends StatefulWidget {
  final String category;
  final String time;
  final String title;
  final int quizzes;
  final String sharedBy;
  final VoidCallback? onTap;
  final bool isStarred; // Add this parameter to control initial state

  const QuizCard({
    Key? key,
    required this.category,
    required this.time,
    required this.title,
    required this.quizzes,
    required this.sharedBy,
    this.onTap,
    this.isStarred = true, // Default to false
  }) : super(key: key);

  @override
  _QuizCardState createState() => _QuizCardState();
}

class _QuizCardState extends State<QuizCard> {
  late bool _isStarred; // Local state for the star button

  @override
  void initState() {
    super.initState();
    _isStarred = widget.isStarred; // Initialize with the widget's value
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    return GestureDetector(
      onTap: widget.onTap,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              spreadRadius: 2,
              blurRadius: 8,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Card(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(color: Color(0xFFEFEEFC), width: 1),
          ),
          elevation: 0,
          color: Color(0xFFFFFFFF),
          child: Padding(
            padding: EdgeInsets.all(screenWidth * 0.04),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    // Category Chip
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
                          Text(
                            widget.category,
                            style: TextStyle(
                              color: Color(0xFFF2B91E),
                              fontFamily: 'Georgia',
                              fontSize: screenWidth * 0.04,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          SizedBox(width: screenWidth * 0.02),
                        ],
                      ),
                    ),
                    SizedBox(width: screenWidth * 0.02),
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
                            size: screenWidth * 0.04,
                          ),
                          SizedBox(width: screenWidth * 0.02),
                          Text(
                            widget.time,
                            style: TextStyle(
                              color: Color(0xFF252525),
                              fontFamily: 'Georgia',
                              fontSize: screenWidth * 0.04,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  
                  ],
                ),
                SizedBox(height: screenHeight * 0.02),
                // Title
                Text(
                  widget.title,
                  style: TextStyle(
                    color: Color(0xFF252525),
                    fontFamily: 'Georgia',
                    fontSize: screenWidth * 0.06,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                SizedBox(height: screenHeight * 0.01),
                // Quizzes Count
                Text(
                  "${widget.quizzes} Quizzes",
                  style: TextStyle(
                    color: Color(0xFF252525),
                    fontFamily: 'Georgia',
                    fontSize: screenWidth * 0.035,
                    fontWeight: FontWeight.w400,
                    height: 1.5,
                  ),
                ),
                SizedBox(height: screenHeight * 0.02),
                // Shared By Section
                Row(
                  children: [
                    CircleAvatar(
                      radius: screenWidth * 0.05,
                      backgroundImage: AssetImage('assets/profile_picture.png'),
                    ),
                    SizedBox(width: screenWidth * 0.02),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Shared by",
                          style: TextStyle(
                            color: Color(0xFF252525),
                            fontFamily: 'Georgia',
                            fontSize: screenWidth * 0.035,
                            fontWeight: FontWeight.w400,
                            height: 1.5,
                          ),
                        ),
                        Text(
                          widget.sharedBy,
                          style: TextStyle(
                            color: Color(0xFF252525),
                            fontFamily: 'Georgia',
                            fontSize: screenWidth * 0.035,
                            fontWeight: FontWeight.w400,
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                    Spacer(),
                    // Start Now Button
                    ElevatedButton(
                      onPressed: _isStarred ? () {} : null,
                      style: ElevatedButton.styleFrom(
                        padding: EdgeInsets.zero, // Remove default padding
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(48),
                          side:
                              _isStarred
                                  ? BorderSide.none
                                  : BorderSide(
                                    color: Colors.grey[200]!, 
                                    width: 1,
                                  ),
                        ),
                        backgroundColor: Colors.transparent,
                        shadowColor: Colors.transparent,
                      ),
                      child: Ink(
                        decoration: BoxDecoration(
                          gradient:
                              _isStarred
                                  ? LinearGradient(
                                    colors: [
                                      Color(0xFF31BCE2),
                                      Color(0xFF0664AE),
                                    ],
                                  )
                                  : LinearGradient(
                                    colors: [
                                      Colors.grey[100]!,
                                      Colors.grey[100]!,
                                    ],
                                  ),
                          borderRadius: BorderRadius.circular(48),
                        ),
                        child: Container(
                          constraints: BoxConstraints(
                            minWidth: screenHeight * 0.15, // Set minimum width
                            minHeight:screenHeight * 0.05, // Set minimum height
                          ),
                          padding: EdgeInsets.symmetric(
                            horizontal: screenWidth * 0.02,
                            vertical: screenHeight * 0.01,
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            "Start Now",
                            style: TextStyle(
                              color:
                                  _isStarred ? Colors.white : Colors.grey[350],
                              fontFamily: 'Georgia',
                              fontSize: screenWidth * 0.04,
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
