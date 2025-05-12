import 'package:flutter/material.dart';
import '../integration/models/models.dart';
import '../pages/CorrectionSection.dart';

class QuizCard extends StatelessWidget {
  final Result result;

  const QuizCard({super.key, required this.result});

  String _formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  bool _isQuizEnded(Result result) {
    final now = DateTime.now();
    return now.isAfter(result.quizEndTime);
  }

  @override
  Widget build(BuildContext context) {
    final double percentage = result.percentageScore;
    final Color progressColor = percentage >= 80
        ? Colors.green
        : percentage >= 60
            ? Colors.orange
            : Colors.red;

    final bool quizEnded = _isQuizEnded(result);

    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              result.quizTitle,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Score: ${result.score.toStringAsFixed(1)}/${result.maxScore.toStringAsFixed(1)}',
                  style: const TextStyle(fontSize: 16),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: progressColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: progressColor),
                  ),
                  child: Text(
                    '${percentage.toStringAsFixed(1)}%',
                    style: TextStyle(
                      color: progressColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: result.score / result.maxScore,
              backgroundColor: Colors.grey[200],
              valueColor: AlwaysStoppedAnimation<Color>(progressColor),
            ),
            const SizedBox(height: 8),
            Text(
              'Completed: ${_formatDateTime(result.completedAt)}',
              style: TextStyle(color: Colors.grey[600], fontSize: 14),
            ),
            if (result.quizEndTime != null) ...[
              const SizedBox(height: 8),
              Text(
                quizEnded
                    ? 'Quiz ended: ${_formatDateTime(result.quizEndTime)}'
                    : 'Quiz ends: ${_formatDateTime(result.quizEndTime)}',
                style: TextStyle(
                  color: quizEnded ? Colors.grey[600] : Colors.blue[800],
                  fontSize: 14,
                  fontWeight: quizEnded ? FontWeight.normal : FontWeight.bold,
                ),
              ),
            ],
            const SizedBox(height: 12),
            if (quizEnded) ...[
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.fact_check),
                  label: const Text('See Correction'),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => Scaffold(
                          appBar: AppBar(
                            title: Text('Correction: ${result.quizTitle}'),
                            centerTitle: true,
                          ),
                          body: CorrectionSection(result: result),
                        ),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ),
            ] else ...[
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  icon: const Icon(Icons.lock_clock),
                  label: const Text('Correction Not Available Yet'),
                  onPressed: null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.grey[300],
                    foregroundColor: Colors.grey[600],
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
