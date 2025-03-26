import 'package:flutter/material.dart';
import 'page5.dart';

class ResetPasswordPage extends StatefulWidget {
  const ResetPasswordPage({super.key});

  @override
  _ResetPasswordPageState createState() => _ResetPasswordPageState();
}

class _ResetPasswordPageState extends State<ResetPasswordPage> {
  bool _isObscure1 = true;
  bool _isObscure2 = true;
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
       backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: Container(
          margin: EdgeInsets.all(8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12 ),
            border: Border.all(
              color: Colors.grey[300]!,
              width: 1,
            ),
          ),
          child: IconButton(
            icon: Icon(Icons.arrow_back, 
              color: Colors.black,
              size: 24 ),
            padding: EdgeInsets.zero,
            constraints: BoxConstraints(),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 25),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
          

            const SizedBox(height: 20),

            // Header Text
            const Text(
              "Create new password", // Text in lowercase to demonstrate capitalization
              style: TextStyle(
                color: Color(0xFF262626), // #262626
                fontFamily: 'Georgia',
                fontSize: 32,
                fontStyle: FontStyle.normal,
                fontWeight: FontWeight.w700, // 700 = bold
                height: 1.0, // line-height: normal
              ),
            ), // Add this extension method

            const SizedBox(height: 12),

            // Description Text
            const Text(
              "Your new password must be unique from those previously used.",
              style: TextStyle(
                color: Color(0xFF5D5D5D), // #5D5D5D
                fontFamily: 'Georgia',
                fontSize: 14,
                fontStyle: FontStyle.normal,
                fontWeight: FontWeight.w400, // 400 = normal
                height: 1.5, // line-height: 150% (21px)
              ),
            ),

            const SizedBox(height: 32),

            // Current Password Input
            Container(
              width: 364.541,
              height: 50,
              decoration: BoxDecoration(
                color: const Color(0xFFE9F6FE),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(width: 1, color: const Color(0xFFE8ECF4)),
              ),
              child: TextField(
                obscureText: _isObscure1,
                textAlignVertical: TextAlignVertical.center, // Vertical center
                style: const TextStyle(
                  color: Color(0xFF888888),
                  fontFamily: 'Georgia',
                  fontSize: 16,
                  fontWeight: FontWeight.w400,
                  height: 1.0,
                ),
                decoration: InputDecoration(
                  border: InputBorder.none,
                  hintText: 'Current Password',
                  hintStyle: const TextStyle(
                    color: Color(0xFF888888),
                    fontFamily: 'Georgia',
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                  ),
                  contentPadding: const EdgeInsets.only(
                    left: 15, // Left padding only
                    top: 19, // Adjusted for perfect vertical centering
                    bottom: 16,
                  ),
                  isCollapsed: true,
                  suffixIcon: IconButton(
                    icon: Icon(
                      _isObscure1 ? Icons.visibility_off : Icons.visibility,
                      color: const Color(0xFF888888),
                    ),
                    onPressed: () {
                      setState(() {
                        _isObscure1 = !_isObscure1;
                      });
                    },
                  ),
                ),
              ),
            ),

            const SizedBox(height: 12),

            // New Password Input
            Container(
              width: 364.541,
              height: 50,
              decoration: BoxDecoration(
                color: const Color(0xFFE9F6FE),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(width: 1, color: const Color(0xFFE8ECF4)),
              ),
              child: TextField(
                obscureText: _isObscure2,
                textAlignVertical: TextAlignVertical.center, // Vertical center
                style: const TextStyle(
                  color: Color(0xFF888888),
                  fontFamily: 'Georgia',
                  fontSize: 16,
                  fontWeight: FontWeight.w400,
                  height: 1.0,
                ),
                decoration: InputDecoration(
                  border: InputBorder.none,
                  hintText: 'New Password',
                  hintStyle: const TextStyle(
                    color: Color(0xFF888888),
                    fontFamily: 'Georgia',
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                  ),
                  contentPadding: const EdgeInsets.only(
                    left: 15, // Left padding only
                    top: 19, // Adjusted for perfect vertical centering
                    bottom: 16,
                  ),
                  isCollapsed: true,
                  suffixIcon: IconButton(
                    icon: Icon(
                      _isObscure2 ? Icons.visibility_off : Icons.visibility,
                      color: const Color(0xFF888888),
                    ),
                    onPressed: () {
                      setState(() {
                        _isObscure2= !_isObscure2;
                      });
                    },
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),

            // 📌 Confirm Password Input
            Container(
              width: 364.541,
              height: 50,
              decoration: BoxDecoration(
                color: const Color(0xFFE9F6FE),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(width: 1, color: const Color(0xFFE8ECF4)),
              ),
              child: TextField(
                obscureText: _isObscure2,
                textAlignVertical: TextAlignVertical.center, // Vertical center
                style: const TextStyle(
                  color: Color(0xFF888888),
                  fontFamily: 'Georgia',
                  fontSize: 16,
                  fontWeight: FontWeight.w400,
                  height: 1.0,
                ),
                decoration: InputDecoration(
                  border: InputBorder.none,
                  hintText: 'Confirm Password',
                  hintStyle: const TextStyle(
                    color: Color(0xFF888888),
                    fontFamily: 'Georgia',
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                  ),
                  contentPadding: const EdgeInsets.only(
                    left: 15, // Left padding only
                    top: 19, // Adjusted for perfect vertical centering
                    bottom: 16,
                  ),
                  isCollapsed: true,
                  suffixIcon: IconButton(
                    icon: Icon(
                      _isObscure2? Icons.visibility_off : Icons.visibility,
                      color: const Color(0xFF888888),
                    ),
                    onPressed: () {
                      setState(() {
                        _isObscure2 = !_isObscure2;
                      });
                    },
                  ),
                ),
              ),
            ),

            const SizedBox(height: 32),

            //  Reset Password Button
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF31BCE2), Color(0xFF0664AE)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: BorderRadius.circular(18),
              ),

              child: ElevatedButton(
                onPressed: () {
                  // Here you would typically save all changes
                  // including the userimg, text fields, and switch states
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => Page5()),
                  );
                },
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                  ),
                ),

                child: Text('Reset Password', style: TextStyle(fontSize: 16)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
