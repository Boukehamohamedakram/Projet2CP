import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/models.dart';

class ApiService {
  final String baseUrl = 'http://10.0.19.177:8000/api';
  String? _authToken;

  // Get stored token
  Future<String?> get authToken async {
    if (_authToken == null) {
      final prefs = await SharedPreferences.getInstance();
      _authToken = prefs.getString('auth_token');
    }
    return _authToken;
  }

  // Set auth token
  Future<void> setAuthToken(String token) async {
    _authToken = token;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  // Get auth headers
  Future<Map<String, String>> get headers async {
    final token = await authToken;
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

// Authentication APIs
  Future<User> login(String username, String password) async {
    try {
      print('Attempting login for user: $username');
      final url = '$baseUrl/users/login/';
      print('Login URL: $url');

      // Remove Basic Auth and just send credentials in body
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({
          'username': username,
          'password': password,
        }),
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('Parsed response data: $data');

        // Store the token
        if (data['token'] != null) {
          await setAuthToken(data['token']);
        }

        // Create user from response data
        return User.fromJson({
          'id': data['id'],
          'username': data['username'],
          'email': data['email'],
          'role': data['role'],
          'token': data['token'],
        });
      } else {
        final error = jsonDecode(response.body);
        throw Exception(
            error['detail'] ?? error['error'] ?? 'Invalid credentials');
      }
    } catch (e) {
      print('Login error: $e');
      throw Exception('Login failed: $e');
    }
  }

  Future<User> register(
      String username, String email, String password, String role) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/users/register/'),
        headers: await headers,
        body: jsonEncode({
          'username': username,
          'email': email,
          'password': password,
          'role': role,
        }),
      );

      print('Register response: ${response.body}');

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        if (data['token'] != null) {
          await setAuthToken(data['token']);
        }
        return User.fromJson(data['user'] ?? data);
      } else {
        throw Exception(
            'Registration failed: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('Registration error: $e');
      throw Exception('Registration failed: $e');
    }
  }

  // Quiz APIs
  Future<List<Quiz>> getQuizzes() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/Quiz/quizzes/'),
        headers: await headers,
      );

      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        return data.map((quiz) => Quiz.fromJson(quiz)).toList();
      } else {
        throw Exception('Failed to load quizzes: ${response.statusCode}');
      }
    } catch (e) {
      print('Get quizzes error: $e');
      throw Exception('Failed to load quizzes: $e');
    }
  }

  Future<List<Quiz>> getAssignedQuizzes() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/Quiz/quizzes/assigned/'),
        headers: await headers,
      );

      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        return data.map((quiz) => Quiz.fromJson(quiz)).toList();
      } else {
        throw Exception('Failed to load assigned quizzes');
      }
    } catch (e) {
      print('Get assigned quizzes error: $e');
      throw Exception('Failed to load assigned quizzes: $e');
    }
  }

  Future<Quiz> getQuizById(int quizId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/Quiz/quizzes/$quizId/'),
        headers: await headers,
      );

      if (response.statusCode == 200) {
        return Quiz.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to load quiz');
      }
    } catch (e) {
      print('Get quiz error: $e');
      throw Exception('Failed to load quiz: $e');
    }
  }

  Future<Quiz> createQuiz(Quiz quiz) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/Quiz/quizzes/'),
        headers: await headers,
        body: jsonEncode(quiz.toJson()),
      );

      if (response.statusCode == 201) {
        return Quiz.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to create quiz');
      }
    } catch (e) {
      print('Create quiz error: $e');
      throw Exception('Failed to create quiz: $e');
    }
  }

  Future<void> submitAnswer(StudentAnswer answer) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/Quiz/answers/'),
        headers: await headers,
        body: jsonEncode(answer.toJson()),
      );

      if (response.statusCode != 201) {
        throw Exception('Failed to submit answer');
      }
    } catch (e) {
      print('Submit answer error: $e');
      throw Exception('Failed to submit answer: $e');
    }
  }

  Future<List<Result>> getResults() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/Quiz/results/'),
        headers: await headers,
      );

      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        return data.map((result) => Result.fromJson(result)).toList();
      } else {
        throw Exception('Failed to load results');
      }
    } catch (e) {
      print('Get results error: $e');
      throw Exception('Failed to load results: $e');
    }
  }

  // Logout method to clear token
  Future<void> logout() async {
    _authToken = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }
}
