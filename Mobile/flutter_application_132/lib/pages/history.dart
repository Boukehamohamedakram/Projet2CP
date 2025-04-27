import 'package:flutter/material.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz History'),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildHistoryTile('Math Challenge', 'Completed on 2025-04-12', 85),
          _buildHistoryTile('Science Quiz', 'Completed on 2025-04-10', 92),
          _buildHistoryTile('History Trivia', 'Completed on 2025-04-08', 78),
        ],
      ),
    );
  }

  Widget _buildHistoryTile(String title, String subtitle, int score) {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle),
        trailing: Text(
          '$score%',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: score >= 80 ? Colors.green : Colors.orange,
          ),
        ),
      ),
    );
  }
}
