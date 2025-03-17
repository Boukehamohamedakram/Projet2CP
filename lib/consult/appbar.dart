import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String titel;
  final int num;
  final int qnum;

  const CustomAppBar({
    Key? key,
    required this.titel,
    required this.qnum,
    required this.num,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final double screenWidth = MediaQuery.of(context).size.width;
    final double refWidth = 375.0;
    final double scaleFactor = screenWidth / refWidth;

    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      automaticallyImplyLeading: false,
      toolbarHeight: preferredSize.height,
      title: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: screenWidth * 0.9, // Increased from 0.7 to 0.9
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Flexible(
                    child: Container(
                      margin: EdgeInsets.only(right: 16 * scaleFactor),
                      child: Text(
                        titel,
                        style: TextStyle(
                          color: const Color(0xFF0C092A),
                          fontFamily: 'Georgia',
                          fontSize: 36 * scaleFactor, // Increased font size
                          fontWeight: FontWeight.w700,
                        ),
                        textAlign: TextAlign.left,
                        softWrap: true,
                        maxLines: 3, // Increased from 2 to 3
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ),
                  Container(
                    width: 40 * scaleFactor,
                    height: 40 * scaleFactor,
                    child: IconButton(
                      iconSize: 24 * scaleFactor,
                      icon: const Icon(Icons.close),
                      color: const Color(0xFF0C092A),
                      style: IconButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12 * scaleFactor),
                          side: const BorderSide(
                            color: Colors.grey,
                            width: 1.0,
                          ),
                        ),
                        padding: EdgeInsets.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        fixedSize: Size(40 * scaleFactor, 40 * scaleFactor),
                      ),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 40 * scaleFactor),
            Container(
              width: screenWidth * 0.9, // Match the increased width
              child: LayoutBuilder(
                builder: (context, constraints) {
                  final segmentWidth = (constraints.maxWidth - (num - 1) * 4 * scaleFactor) / num;
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: List.generate(num, (index) {
                      return Container(
                        width: segmentWidth,
                        height: 4 * scaleFactor,
                        decoration: BoxDecoration(
                          color: index < qnum ? Color(0xFF127CBC) : Colors.grey[300],
                          borderRadius: BorderRadius.circular(2 * scaleFactor),
                        ),
                      );
                    }),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(180);
}