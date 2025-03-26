import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class UpPersonalInfoCard extends StatefulWidget {
  final TextEditingController fullNameController;
  final TextEditingController dobController;
  final TextEditingController emailController;
  final File? userimg;
  final Function(File)? onImageSelected;

  const UpPersonalInfoCard({
    Key? key,
    required this.fullNameController,
    required this.dobController,
    required this.emailController,
    this.userimg,
    this.onImageSelected,
  }) : super(key: key);

  @override
  _UpPersonalInfoCardState createState() => _UpPersonalInfoCardState();
}

class _UpPersonalInfoCardState extends State<UpPersonalInfoCard> {
  late File? _currentImage;

  @override
  void initState() {
    super.initState();
    _currentImage = widget.userimg;
  }

  Future<void> _pickImage() async {
    final ImagePicker picker = ImagePicker();
    try {
      final XFile? pickedFile = await picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 800,
        maxHeight: 800,
        imageQuality: 90,
      );

      if (pickedFile != null) {
        final File newImage = File(pickedFile.path);
        setState(() {
          _currentImage = newImage;
        });
        widget.onImageSelected?.call(newImage);
      }
    } catch (e) {
      print("Image picker error: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to pick image: $e")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;
    final scaleFactor = screenWidth / 375; // Base width (iPhone 8)

    return Container(
      padding: EdgeInsets.fromLTRB(
        30 * scaleFactor,
        16 * scaleFactor,
        16 * scaleFactor,
        30 * scaleFactor,
      ),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF31BCE2), Color(0xFF0664AE)],
        ),
        borderRadius: BorderRadius.circular(21.67 * scaleFactor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            "Personal Info",
            style: TextStyle(
              fontSize: 24 * scaleFactor,
              fontFamily: 'Georgia',
              fontWeight: FontWeight.w400,
              color: const Color(0xFFFFFFFF),
            ),
          ),
          SizedBox(height: 16 * scaleFactor),
        
              Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    _buildImageSection(28 * scaleFactor),
                    SizedBox(width: 16 * scaleFactor),
                    _buildUploadButton(scaleFactor),
                  ],
                ),
          SizedBox(height: 16 * scaleFactor),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildInfoRow('Full Name', widget.fullNameController, scaleFactor),
              SizedBox(height: 8 * scaleFactor),
              _buildInfoRow('Date of Birth', widget.dobController, scaleFactor),
              SizedBox(height: 8 * scaleFactor),
              _buildInfoRow('Email', widget.emailController, scaleFactor),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildImageSection(double radius) {
    return GestureDetector(
      onTap: _pickImage,
      child: CircleAvatar(
        backgroundColor: Colors.white,
        radius: radius,
        backgroundImage: _currentImage != null ? FileImage(_currentImage!) : null,
        child: _currentImage == null
            ? Icon(
                Icons.person,
                color: const Color(0xFF62B2FF),
                size: radius * 1.4,
              )
            : null,
      ),
    );
  }

  Widget _buildUploadButton(double scaleFactor) {
    return ElevatedButton(
      onPressed: _pickImage,
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.transparent,
        elevation: 0,
        padding: EdgeInsets.symmetric(
          horizontal: 20 * scaleFactor,
          vertical: 8 * scaleFactor,
        ),
        minimumSize: Size.zero,
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(50 * scaleFactor),
          side: BorderSide(
            color: Colors.white,
            width: 2 * scaleFactor,
          ),
        ),
      ),
      child: Text(
        'Upload a new picture',
        style: TextStyle(
          color: Colors.white,
          fontSize: 16 * scaleFactor,
          fontFamily: 'Georgia',
          fontWeight: FontWeight.w400,
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, TextEditingController controller, double scaleFactor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            color: const Color(0xFFFFFFFF),
            fontFamily: 'Georgia',
            fontSize: 16 * scaleFactor,
            fontWeight: FontWeight.w700,
            height: 1.0,
          ),
        ),
        Container(
          width: 200 * scaleFactor,
          height: 30 * scaleFactor,
          decoration: ShapeDecoration(
            color: const Color(0xFFE9F6FE),
            shape: RoundedRectangleBorder(
              side: BorderSide(
                width: 1 * scaleFactor,
                color: const Color(0xFFE8ECF4),
              ),
              borderRadius: BorderRadius.circular(18 * scaleFactor),
            ),
          ),
          child: TextField(
            controller: controller,
            decoration: InputDecoration(
              border: InputBorder.none,
              contentPadding: EdgeInsets.symmetric(
                horizontal: 12 * scaleFactor,
                vertical: 5 * scaleFactor,
              ),
              isCollapsed: true,
            ),
            style: TextStyle(
              fontFamily: 'Georgia',
              fontSize: 16 * scaleFactor,
              fontWeight: FontWeight.w400,
              color: Colors.black,
              height: 1.0,
            ),
            textAlign: TextAlign.center,
            textAlignVertical: TextAlignVertical.center,
            textCapitalization: TextCapitalization.words,
            maxLines: 1,
          ),
        ),
      ],
    );
  }
}