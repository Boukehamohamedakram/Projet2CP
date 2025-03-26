import 'package:flutter/material.dart';
import '../page4.dart';
import '../page2.dart';

class PersonalInfoCard extends StatelessWidget {
  final String fullName;
  final String dateOfBirth;
  final String email;
  final ImageProvider img;

  const PersonalInfoCard({
    Key? key,
    required this.fullName,
    required this.dateOfBirth,
    required this.email,
    required this.img,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;
    final isSmallScreen = screenWidth < 600;

    return LayoutBuilder(
      builder: (context, constraints) {
        return Container(
          padding: EdgeInsets.all(screenWidth * 0.04),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xFF31BCE2),
                Color(0xFF0664AE),
              ],
            ),
            borderRadius: BorderRadius.circular(screenWidth * 0.05),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Text(
                  "Personal Info",
                  style: TextStyle(
                    fontSize: isSmallScreen ? screenWidth * 0.07 : 24,
                    fontFamily: 'Georgia',
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFFFFFFFF),
                  ),
                ),
              ),
              SizedBox(height: screenHeight * 0.02),
              Row(
                children: [
                  CircleAvatar(
                    backgroundColor: Colors.white,
                    radius: isSmallScreen ? screenWidth * 0.08 : 30,
                    backgroundImage: img,
                  ),
                  SizedBox(width: screenWidth * 0.04),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildInfoRow(context, 'Full Name: ', fullName),
                        SizedBox(height: screenHeight * 0.005),
                        _buildInfoRow(context, 'Date of Birth: ', dateOfBirth),
                        SizedBox(height: screenHeight * 0.005),
                        _buildInfoRow(context, 'Email: ', email),
                      ],
                    ),
                  ),
                ],
              ),
              SizedBox(height: screenHeight * 0.02),
              _buildButtonLayout(context),
            ],
          ),
        );
      },
    );
  }

  Widget _buildInfoRow(BuildContext context, String label, String value) {
    final screenWidth = MediaQuery.of(context).size.width;

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: screenWidth * 0.03,
        vertical: screenWidth * 0.015,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(screenWidth * 0.1),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Flexible(
            child: Text(
              label,
              style: TextStyle(
                color: Colors.black,
                fontFamily: 'Georgia',
                fontSize: screenWidth * 0.04,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Flexible(
            child: Text(
              value,
              style: TextStyle(
                color: Colors.black,
                fontFamily: 'Georgia',
                fontSize: screenWidth * 0.04,
                fontWeight: FontWeight.w400,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildButtonLayout(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    
    
  
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: _buildOutlinedButton(context, 'Change Password', ResetPasswordPage()),
        ),
        SizedBox(width: screenWidth * 0.03),
        Expanded(
          child: _buildOutlinedButton(context, 'Update Profile', SettingsPage2()),
        ),
      ],
    );
  }

  Widget _buildOutlinedButton(BuildContext context, String text, Widget page) {
  final mediaQuery = MediaQuery.of(context);
  final screenWidth = mediaQuery.size.width;
  final screenHeight = mediaQuery.size.height;

  return OutlinedButton(
    onPressed: () => Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => page),
    ),
    style: OutlinedButton.styleFrom(
      padding: EdgeInsets.symmetric(
        horizontal: screenWidth * 0.03,
        vertical: screenHeight * 0.01, 
      ),
      side: const BorderSide(width: 2, color: Color(0xFFFFFFFF)),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(screenWidth * 0.1),
      ),
    ),
    child: Text(
      text,
      style: TextStyle(
        color: const Color(0xFFFFFFFF),
        fontFamily: 'Georgia',
        fontSize: screenWidth * 0.04,
        fontWeight: FontWeight.w400,
      ),
    ),
  );
}
}