import 'package:flutter/material.dart';
import 'page1.dart';

class Page5 extends StatelessWidget {
  const Page5({super.key});

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final scaleFactor = screenWidth / 375; // Base width (iPhone 8)
    final isSmallScreen = screenWidth < 400;

    return Scaffold(
      body: Center(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 25 * scaleFactor),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // ✅ Success Icon
              Image.asset(
                'assets/img/group337.png',
                width: 100 * scaleFactor,
                height: 100 * scaleFactor,
              ),

              SizedBox(height: isSmallScreen ? 24 : 32 * scaleFactor),

              // Success Message
              Text(
                "Password Changed!",
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: const Color(0xFF262626),
                  fontFamily: 'Georgia',
                  fontSize: isSmallScreen ? 28 : 32 * scaleFactor,
                  fontStyle: FontStyle.normal,
                  fontWeight: FontWeight.w700,
                  height: 1.0,
                ),
              ),

              SizedBox(height: isSmallScreen ? 8 : 12 * scaleFactor),

              // Description
              Text(
                "Your password has been changed successfully.",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: isSmallScreen ? 13 : 14 * scaleFactor,
                  color: const Color(0xFF5D5D5D),
                  fontFamily: 'Georgia',
                  fontStyle: FontStyle.normal,
                  fontWeight: FontWeight.w400,
                  height: 1.2, // Slightly more readable line height
                ),
              ),
              SizedBox(height: isSmallScreen ? 24 : 32 * scaleFactor),

              Container(
                width: double.infinity,
                constraints: BoxConstraints(
                  maxWidth: 400 * scaleFactor, // Prevent button from becoming too wide
                ),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF31BCE2), Color(0xFF0664AE)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(18 * scaleFactor),
                ),
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => SettingsPage()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(
                      vertical: isSmallScreen ? 14 : 16 * scaleFactor,
                    ),
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18 * scaleFactor),
                    ),
                    minimumSize: Size(
                      50 * scaleFactor, 
                      isSmallScreen ? 48 : 50 * scaleFactor
                    ), // Minimum tap target size
                  ),
                  child: Text(
                    'Back to Settings',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 15 : 16 * scaleFactor,
                      fontFamily: 'Georgia',
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}