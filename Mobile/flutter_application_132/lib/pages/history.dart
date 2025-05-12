import 'package:flutter/material.dart';
import '../integration/services/api_service.dart';
import '../integration/models/models.dart';
import 'CorrectionSection.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  final ApiService _apiService = ApiService();
  List<Result> _history = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    if (!mounted) return;

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final history = await _apiService.getQuizHistory();
      if (!mounted) return;
      history.sort((a, b) => b.completedAt.compareTo(a.completedAt));
      setState(() {
        _history = history;
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  String _formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  bool _isQuizEnded(Result result) {
    // Debug print to help troubleshoot time comparison issues
    print('Quiz "${result.quizTitle}" end time: ${result.quizEndTime}');
    print('Current time: ${DateTime.now()}');

    // Add a safety check to ensure quizEndTime is not null
    if (result.quizEndTime == null) {
      return true; // If no end time is set, consider it ended
    }

    // Normalize both times to just date and hour/minute to avoid
    // issues with seconds/milliseconds and timezone discrepancies
    final now = DateTime.now();
    final normalizedNow =
        DateTime(now.year, now.month, now.day, now.hour, now.minute);

    final endTime = result.quizEndTime;
    final normalizedEndTime = DateTime(
        endTime.year, endTime.month, endTime.day, endTime.hour, endTime.minute);

    // Print normalized times for debugging
    print('Normalized now: $normalizedNow');
    print('Normalized end time: $normalizedEndTime');

    // Compare normalized times
    final comparison = normalizedNow.isAfter(normalizedEndTime) ||
        normalizedNow.isAtSameMomentAs(normalizedEndTime);
    print('Quiz ended (comparison result): $comparison');

    return comparison;
  }

  Widget _buildHistoryCard(Result result) {
    final double percentage = result.percentageScore;
    final Color progressColor = percentage >= 80
        ? Colors.green
        : percentage >= 60
            ? Colors.orange
            : Colors.red;

    // Determine if quiz has ended
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz History'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadHistory,
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadHistory,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
                ? _buildErrorWidget()
                : _history.isEmpty
                    ? _buildEmptyState()
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        itemCount: _history.length,
                        itemBuilder: (context, index) {
                          return _buildHistoryCard(_history[index]);
                        },
                      ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.history_edu, size: 64, color: Colors.grey[400]),
          const SizedBox(height: 16),
          Text(
            'No quiz history available',
            style: TextStyle(fontSize: 18, color: Colors.grey[600]),
          ),
          const SizedBox(height: 16),
          TextButton.icon(
            onPressed: _loadHistory,
            icon: const Icon(Icons.refresh),
            label: const Text('Refresh'),
            style: TextButton.styleFrom(foregroundColor: Colors.blue),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorWidget() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 48, color: Colors.red[300]),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Text(
              _error!,
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.red[700]),
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: _loadHistory,
            icon: const Icon(Icons.refresh),
            label: const Text('Retry'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}
