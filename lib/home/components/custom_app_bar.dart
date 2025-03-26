import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String username;
  final String profilePicture;

  const CustomAppBar({
    Key? key,
    required this.username,
    required this.profilePicture,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final double screenWidth = MediaQuery.of(context).size.width;
    final double screenHeight = MediaQuery.of(context).size.height;

    return AppBar(
      elevation: 0,
      backgroundColor: Colors.white,
      automaticallyImplyLeading: false,
      toolbarHeight: kToolbarHeight * 1.4, // Increase the height of the AppBar
      title: Padding(
        padding: EdgeInsets.only(
          top: screenHeight * 0.02, // Add top padding
          bottom: screenHeight * 0.02, // Add bottom padding
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Image.asset(
                  "assets/img/homeimg/Frame2.png",
                  width: screenWidth * 0.05, // 5% of screen width
                  height: screenWidth * 0.05, // 5% of screen width
                ),
                SizedBox(width: screenWidth * 0.02), // 2% of screen width
                Text(
                  "Good Morning",
                  style: TextStyle(
                    color: Color(0xFFF2B91E),
                    fontFamily: "ChalkboardSE",
                    fontSize: screenWidth * 0.03, // 3% of screen width
                    fontStyle: FontStyle.normal,
                    fontWeight: FontWeight.w400,
                    height: 1.5,
                    letterSpacing: 0.48,
                  ),
                ),
              ],
            ),
            SizedBox(height: screenHeight * 0.01), // 1% of screen height
            Text(
              username,
              style: TextStyle(
                color: Color(0xFF292621),
                fontFamily: 'Georgia',
                fontSize: screenWidth * 0.06, // 6% of screen width
                fontStyle: FontStyle.normal,
                fontWeight: FontWeight.w700,
                height: 1.0,
              ),
            ),
          ],
        ),
      ),
      actions: [
        Padding(
          padding: EdgeInsets.only(
            right: screenWidth * 0.05, // 5% of screen width
            top: screenHeight * 0.02, // Add top padding
            bottom: screenHeight * 0.02, // Add bottom padding
          ),
          child: Image.asset(
            profilePicture,
            width: screenWidth * 0.12, // 12% of screen width
            height: screenWidth * 0.12, // 12% of screen width
          ),
        ),
      ],
    );
  }

  @override
  Size get preferredSize => Size.fromHeight(kToolbarHeight * 1.4); // Increase the height by 40%
}