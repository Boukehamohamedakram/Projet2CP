import 'package:flutter/material.dart';
import 'components/PersonalInfoCard.dart';

class SettingsPage extends StatefulWidget {
  @override
  _SettingsPageState createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool isNotificationEnabled = true;
  bool isSoundEnabled = true;
  bool isVibrateEnabled = true;

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;
    final isSmallScreen = screenWidth < 600;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Container(
          margin: EdgeInsets.all(isSmallScreen ? 8 : 12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(isSmallScreen ? 12 : 16),
            border: Border.all(
              color: Colors.grey[300]!,
              width: 1,
            ),
          ),
          child: IconButton(
            icon: Icon(Icons.arrow_back, 
              color: Colors.black,
              size: isSmallScreen ? 24 : 30),
            padding: EdgeInsets.zero,
            constraints: BoxConstraints(),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(
          horizontal: isSmallScreen ? 16 : 24,
          vertical: 16
        ),
        child: ConstrainedBox(
          constraints: BoxConstraints(
            minHeight: screenHeight,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: isSmallScreen ? 10 : 20),
              Text(
                'Settings',
                style: TextStyle(
                  fontSize: isSmallScreen ? 32 : 40,
                  fontFamily: 'ChalkboardSE',
                  fontWeight: FontWeight.w400,
                  color: Color(0xFF262626),
                ),
              ),
              SizedBox(height: isSmallScreen ? 24 : 32),
              
              // Personal Info Card
              LayoutBuilder(
                builder: (context, constraints) {
                  return PersonalInfoCard(
                    fullName: 'John Smith',
                    dateOfBirth: '09 / 10 / 1991',
                    email: 'john@example.com',
                    img: AssetImage('assets/img/homeimg/Avatar.png'),
                  );
                },
              ),

              SizedBox(height: isSmallScreen ? 24 : 32),

              // Notification Settings Section
              _buildSettingRow(
                context,
                icon: isNotificationEnabled 
                    ? Icons.notifications 
                    : Icons.notifications_off,
                label: 'General Notification',
                value: isNotificationEnabled,
                onChanged: (value) => setState(() => isNotificationEnabled = value),
              ),

            

              _buildSettingRow(
                context,
                icon: isSoundEnabled ? Icons.volume_up : Icons.volume_off,
                label: 'Sound',
                value: isSoundEnabled,
                onChanged: (value) => setState(() => isSoundEnabled = value),
              ),

              _buildSettingRow(
                context,
                icon: Icons.vibration,
                label: 'Vibration',
                value: isVibrateEnabled,
                onChanged: (value) => setState(() => isVibrateEnabled = value),
              ),

              SizedBox(height: isSmallScreen ? 24 : 32),

              // Logout Button
              Center(
                child: SizedBox(
                  width: isSmallScreen ? screenWidth * 0.6 : 300,
                  child: TextButton(
                    onPressed: () {
                      // Logout logic
                    },
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.symmetric(
                        vertical: isSmallScreen ? 12 : 16,
                        horizontal: 24
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.logout,
                          color: Color(0xFFB50000),
                          size: isSmallScreen ? 20 : 24,
                        ),
                        SizedBox(width: 12),
                        Text(
                          'Log out',
                          style: TextStyle(
                            color: Color(0xFFB50000),
                            fontFamily: 'Georgia',
                            fontSize: isSmallScreen ? 20 : 24,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
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

  Widget _buildSettingRow(
    BuildContext context, {
    required IconData icon,
    required String label,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    final isSmallScreen = MediaQuery.of(context).size.width < 600;

    return Container(
      padding: EdgeInsets.symmetric(
        vertical: isSmallScreen ? 8 : 12,
        horizontal: isSmallScreen ? 12 : 16,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(
                icon,
                color: value ? Color(0xFF0C71B5) : Color.fromRGBO(12, 113, 181, 0.4),
                size: isSmallScreen ? 24 : 28,
              ),
              SizedBox(width: isSmallScreen ? 12 : 16),
              Text(
                label,
                style: TextStyle(
                  fontFamily: 'Georgia',
                  fontSize: isSmallScreen ? 20 : 24,
                  fontWeight: FontWeight.w400,
                  color: Colors.black87,
                ),
              ),
            ],
          ),
          Transform.scale(
            scale: isSmallScreen ? 0.7 : 0.8,
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
}