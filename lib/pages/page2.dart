import 'package:flutter/material.dart';
import 'dart:io';
import 'page3.dart';
import 'class/UpPersonalInfoCard.dart';

class SettingsPage2 extends StatefulWidget {
  @override
  _SettingsPageState createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage2> {
  bool isNotificationEnabled = true;
  bool isSoundEnabled = true;
  bool isVibrateEnabled = true;
  
  TextEditingController fullNameController = TextEditingController(
    text: "Yakoub Moussa",
  );
  TextEditingController dobController = TextEditingController(
    text: "09 / 10 / 1991",
  );
  TextEditingController emailController = TextEditingController(
    text: "john@example.com",
  );
  
  File? userimg;

  @override
  void initState() {
    super.initState();
    // Initialize userimg with the default avatar image
    userimg = File('assets/img/homeimg/Avatar.png');
  }

  Future<void> _handleImageSelected(File newImage) async {
    setState(() {
      userimg = newImage;
    });
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;
    final scaleFactor = screenWidth / 393.0; // Pixel 4 width as baseline
    final isSmallScreen = screenWidth < 600;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Container(
          margin: EdgeInsets.all(8 * scaleFactor),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12 * scaleFactor),
            border: Border.all(
              color: Colors.grey[300]!,
              width: 1 * scaleFactor,
            ),
          ),
          child: IconButton(
            icon: Icon(Icons.arrow_back, color: Colors.black),
            iconSize: 24 * scaleFactor,
            onPressed: () => Navigator.pop(context),
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0 * scaleFactor),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 10 * scaleFactor),
            Text(
              'Settings',
              style: TextStyle(
                fontSize: 32 * scaleFactor,
                fontFamily: 'ChalkboardSE',
                fontWeight: FontWeight.w400,
                color: Color(0xFF262626),
              ),
            ),
            SizedBox(height: 24 * scaleFactor),

            // Personal Info Card with image handling
            UpPersonalInfoCard(
              fullNameController: fullNameController,
              dobController: dobController,
              emailController: emailController,
              userimg: userimg,
              onImageSelected: _handleImageSelected,
            ),

            SizedBox(height: isSmallScreen ? 40 * scaleFactor : 100 * scaleFactor),

            // Save Button
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: LinearGradient(
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
                    MaterialPageRoute(builder: (context) => page3()),
                  );
                },
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 16 * scaleFactor),
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18 * scaleFactor),
                  ),
                ),
                child: Text(
                  'Save All Changes', 
                  style: TextStyle(
                    fontSize: 16 * scaleFactor,
                    fontFamily: 'Georgia',
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingSwitch(
    BuildContext context, {
    required IconData icon,
    required String label,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    final scaleFactor = MediaQuery.of(context).size.width / 393.0;
    
    return Container(
      padding: EdgeInsets.symmetric(
        vertical: 8 * scaleFactor, 
        horizontal: 12 * scaleFactor
      ),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12 * scaleFactor),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(
                icon,
                size: 24 * scaleFactor,
                color: value ? Color(0xFF0C71B5) : Color.fromRGBO(12, 113, 181, 0.4),
              ),
              SizedBox(width: 12 * scaleFactor),
              Text(
                label,
                style: TextStyle(
                  fontFamily: 'Georgia',
                  fontSize: 20 * scaleFactor,
                  fontWeight: FontWeight.w400,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
          Transform.scale(
            scale: 0.7 * scaleFactor,
            child: Switch(
              value: value,
              onChanged: onChanged,
              inactiveThumbColor: Colors.white,
              activeTrackColor: Color(0xFF0C71B5),
              inactiveTrackColor: Color.fromRGBO(12, 113, 181, 0.4),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    fullNameController.dispose();
    dobController.dispose();
    emailController.dispose();
    super.dispose();
  }
}