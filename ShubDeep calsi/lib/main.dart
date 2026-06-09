import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'chatbot.dart';
import 'admin.dart'; 
import 'commercial.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:local_auth/local_auth.dart';
import 'glass_widgets.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await loadSavedPrices();
  await loadCommercialPrices();
  runApp(const ShubDeepCustomizerApp());
}

Future<void> loadSavedPrices() async {
  final prefs = await SharedPreferences.getInstance();
  for (var step in stepsData) {
    for (var opt in step.options) {
      if (prefs.containsKey('price_${opt.id}')) {
        opt.price = prefs.getInt('price_${opt.id}') ?? opt.price;
      }
    }
  }
}

class ShubDeepCustomizerApp extends StatelessWidget {
  const ShubDeepCustomizerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ShubDeep',
      theme: ThemeData(
        fontFamily: 'Arial', // Fallback for neat sans-serif
        scaffoldBackgroundColor: Colors.transparent,
        useMaterial3: true,
      ),
      home: const CustomizerScreen(),
    );
  }
}

class OptionItem {
  final String id;
  final String label;
  final IconData icon;
  final Color bgColor;
  final Color borderColor;
  int price;
  final String? desc;
  final List<String>? visibleForCategories;

  OptionItem({
    required this.id,
    required this.label,
    required this.icon,
    required this.bgColor,
    required this.borderColor,
    required this.price,
    this.desc,
    this.visibleForCategories,
  });
}

class StepData {
  final String id;
  final String title;
  final String emoji;
  final String hint;
  final String type; // 'single' or 'multi'
  final List<OptionItem> options;

  StepData({
    required this.id,
    required this.title,
    required this.emoji,
    required this.hint,
    required this.type,
    required this.options,
  });
}

List<StepData> stepsData = [
  StepData(
    id: 'category',
    title: 'Pick Your Field',
    emoji: '🎓',
    hint: 'Choose the one matching your college course',
    type: 'single',
    options: [
      OptionItem(id: 'diploma', label: 'Diploma', icon: Icons.laptop, bgColor: Color(0xFFFFF9C4), borderColor: Color(0xFFFFCA28), price: 0),
      OptionItem(id: 'engineering', label: 'Engineering', icon: Icons.code, bgColor: Color(0xFFE8F5E9), borderColor: Color(0xFF66BB6A), price: 4999),
      OptionItem(id: 'mtech', label: 'M.Tech / Research', icon: Icons.memory, bgColor: Color(0xFFE1F5FE), borderColor: Color(0xFF42A5F5), price: 8999),
      OptionItem(id: 'bca-mca', label: 'BCA / MCA', icon: Icons.storage, bgColor: Color(0xFFF3E5F5), borderColor: Color(0xFFAB47BC), price: 3999),
      OptionItem(id: 'bsc-msc', label: 'B.Sc / M.Sc (IT)', icon: Icons.science, bgColor: Color(0xFFE8F5E9), borderColor: Color(0xFF66BB6A), price: 2999),
      OptionItem(id: 'ai-ml', label: 'AI / ML', icon: Icons.psychology, bgColor: Color(0xFFFFEBEE), borderColor: Color(0xFFEF5350), price: 6999),
      OptionItem(id: 'android', label: 'Android App', icon: Icons.smartphone, bgColor: Color(0xFFE8F5E9), borderColor: Color(0xFF26A69A), price: 5499),
      OptionItem(id: 'phd', label: 'PhD / Thesis', icon: Icons.school, bgColor: Color(0xFFE1F5FE), borderColor: Color(0xFF42A5F5), price: 12999),
      OptionItem(id: 'web-dev', label: 'Web Dev', icon: Icons.web, bgColor: Color(0xFFFFF9C4), borderColor: Color(0xFFFFCA28), price: 4999),
      OptionItem(id: 'ui-ux', label: 'UI/UX Design', icon: Icons.design_services, bgColor: Color(0xFFF3E5F5), borderColor: Color(0xFFAB47BC), price: 2499),
      OptionItem(id: 'cyber-sec', label: 'Cyber Security', icon: Icons.security, bgColor: Color(0xFFFFEBEE), borderColor: Color(0xFFEF5350), price: 7999),
      OptionItem(id: 'blockchain', label: 'Blockchain/Web3', icon: Icons.currency_bitcoin, bgColor: Color(0xFFE8F5E9), borderColor: Color(0xFF66BB6A), price: 8999),
    ],
  ),
  StepData(
    id: 'diploma_packages',
    title: 'Choose Package',
    emoji: '📦',
    hint: 'Select your project scope',
    type: 'single',
    options: [
      OptionItem(id: 'starter', label: 'Starter', icon: Icons.star_border, bgColor: Color(0xFFFFF9C4), borderColor: Color(0xFFFFCA28), price: 1999, desc: 'Basic functional project', visibleForCategories: ['diploma']),
      OptionItem(id: 'skilled', label: 'Skilled', icon: Icons.star_half, bgColor: Color(0xFFE8F5E9), borderColor: Color(0xFF66BB6A), price: 3499, desc: 'Intermediate features', visibleForCategories: ['diploma']),
      OptionItem(id: 'professional', label: 'Professional', icon: Icons.star, bgColor: Color(0xFFE1F5FE), borderColor: Color(0xFF42A5F5), price: 4599, desc: 'Advanced full-stack', visibleForCategories: ['diploma']),
      OptionItem(id: 'custom', label: 'Custom Build', icon: Icons.build, bgColor: Color(0xFFF3E5F5), borderColor: Color(0xFFAB47BC), price: 0, desc: 'Fully tailored project', visibleForCategories: ['diploma']),
    ],
  ),
  StepData(
    id: 'tech',
    title: 'Choose Stack',
    emoji: '⚙️',
    hint: 'Select all that apply',
    type: 'multi',
    options: [
      OptionItem(id: 'html', label: 'HTML/CSS/JS', icon: Icons.language, bgColor: Color(0xFFFFF9C4), borderColor: Color(0xFFFFCA28), price: 0, desc: 'Websites & landing pages', visibleForCategories: ['engineering', 'mtech', 'bca-mca', 'bsc-msc', 'phd', 'web-dev']),
      OptionItem(id: 'react', label: 'React.js', icon: Icons.dashboard, bgColor: Color(0xFFE1F5FE), borderColor: Color(0xFF42A5F5), price: 1499, desc: 'Interactive web dashboards', visibleForCategories: ['engineering', 'mtech', 'bca-mca', 'bsc-msc', 'phd', 'web-dev', 'blockchain']),
      OptionItem(id: 'nextjs', label: 'Next.js', icon: Icons.bolt, bgColor: Color(0xFFF3E5F5), borderColor: Color(0xFFAB47BC), price: 1999, desc: 'Full-stack SSR web apps', visibleForCategories: ['engineering', 'mtech', 'bca-mca', 'bsc-msc', 'phd', 'web-dev', 'blockchain']),
      OptionItem(id: 'mern', label: 'MERN Stack', icon: Icons.dns, bgColor: Color(0xFFFFEBEE), borderColor: Color(0xFFEF5350), price: 2999, desc: 'End-to-end JS portals', visibleForCategories: ['engineering', 'mtech', 'bca-mca', 'bsc-msc', 'phd', 'web-dev']),
      OptionItem(id: 'vue', label: 'Vue.js', icon: Icons.view_quilt, bgColor: Color(0xFFE8F5E9), borderColor: Color(0xFF66BB6A), price: 1499, desc: 'Lightweight web apps', visibleForCategories: ['engineering', 'mtech', 'bca-mca', 'bsc-msc', 'phd', 'web-dev']),
      OptionItem(id: 'angular', label: 'Angular', icon: Icons.web, bgColor: Color(0xFFFFEBEE), borderColor: Color(0xFFEF5350), price: 1999, desc: 'Enterprise frontends', visibleForCategories: ['engineering', 'mtech', 'bca-mca', 'bsc-msc', 'phd', 'web-dev']),
      OptionItem(id: 'svelte', label: 'Svelte', icon: Icons.speed, bgColor: Color(0xFFFFF9C4), borderColor: Color(0xFFFFCA28), price: 1499, desc: 'Fast web apps', visibleForCategories: ['engineering', 'mtech', 'bca-mca', 'bsc-msc', 'phd', 'web-dev']),

      OptionItem(id: 'python-flask', label: 'Python + Flask', icon: Icons.code, bgColor: Color(0xFFE8F5E9), borderColor: Color(0xFF66BB6A), price: 999, desc: 'REST APIs & ML', visibleForCategories: null),
      OptionItem(id: 'nodejs', label: 'Node.js', icon: Icons.javascript, bgColor: Color(0xFFE8F5E9), borderColor: Color(0xFF66BB6A), price: 1499, desc: 'Fast JS backend', visibleForCategories: ['engineering', 'mtech', 'bca-mca', 'android', 'bsc-msc', 'phd', 'web-dev', 'blockchain']),
      OptionItem(id: 'django', label: 'Django', icon: Icons.table_chart, bgColor: Color(0xFFE1F5FE), borderColor: Color(0xFF42A5F5), price: 1999, desc: 'Robust Python backend', visibleForCategories: null),
      OptionItem(id: 'springboot', label: 'Spring Boot', icon: Icons.coffee, bgColor: Color(0xFFF3E5F5), borderColor: Color(0xFFAB47BC), price: 2499, desc: 'Enterprise Java', visibleForCategories: null),
      OptionItem(id: 'php-laravel', label: 'Laravel', icon: Icons.php, bgColor: Color(0xFFFFEBEE), borderColor: Color(0xFFEF5350), price: 1499, desc: 'Standard PHP backend', visibleForCategories: ['engineering', 'mtech', 'bca-mca', 'bsc-msc', 'phd', 'web-dev']),

      OptionItem(id: 'sql', label: 'PostgreSQL/MySQL', icon: Icons.storage, bgColor: Color(0xFFE1F5FE), borderColor: Color(0xFF42A5F5), price: 999, desc: 'Relational DBs', visibleForCategories: null),
      OptionItem(id: 'mongodb', label: 'MongoDB', icon: Icons.data_usage, bgColor: Color(0xFFE8F5E9), borderColor: Color(0xFF66BB6A), price: 999, desc: 'NoSQL document DB', visibleForCategories: null),
      OptionItem(id: 'redis', label: 'Redis', icon: Icons.memory, bgColor: Color(0xFFFFEBEE), borderColor: Color(0xFFEF5350), price: 499, desc: 'High-speed caching', visibleForCategories: null),
      OptionItem(id: 'firebase', label: 'Firebase', icon: Icons.local_fire_department, bgColor: Color(0xFFFFF9C4), borderColor: Color(0xFFFFCA28), price: 999, desc: 'Auth, real-time DB', visibleForCategories: null),

      OptionItem(id: 'android-dev', label: 'Android (Java/XML)', icon: Icons.android, bgColor: Color(0xFFE8F5E9), borderColor: Color(0xFF26A69A), price: 3499, desc: 'Legacy Android apps', visibleForCategories: ['engineering', 'mtech', 'bca-mca', 'android', 'bsc-msc', 'phd']),
      OptionItem(id: 'kotlin', label: 'Kotlin Native', icon: Icons.phone_android, bgColor: Color(0xFFE1F5FE), borderColor: Color(0xFF42A5F5), price: 3499, desc: 'Modern Android apps', visibleForCategories: ['engineering', 'mtech', 'bca-mca', 'android', 'bsc-msc', 'phd']),
      OptionItem(id: 'swift', label: 'Swift (iOS)', icon: Icons.apple, bgColor: Color(0xFFF3E5F5), borderColor: Color(0xFFAB47BC), price: 4499, desc: 'Native Apple apps', visibleForCategories: ['engineering', 'mtech', 'bca-mca', 'android', 'bsc-msc', 'phd']),
      OptionItem(id: 'flutter', label: 'Flutter', icon: Icons.layers, bgColor: Color(0xFFE1F5FE), borderColor: Color(0xFF42A5F5), price: 3999, desc: 'Cross-platform mobile', visibleForCategories: ['engineering', 'mtech', 'bca-mca', 'android', 'bsc-msc', 'phd']),
      OptionItem(id: 'react-native', label: 'React Native', icon: Icons.code, bgColor: Color(0xFFF3E5F5), borderColor: Color(0xFFAB47BC), price: 3999, desc: 'JS cross-platform', visibleForCategories: ['engineering', 'mtech', 'bca-mca', 'android', 'bsc-msc', 'phd']),

      OptionItem(id: 'aws-gcp', label: 'AWS / GCP', icon: Icons.cloud, bgColor: Color(0xFFFFF9C4), borderColor: Color(0xFFFFCA28), price: 1999, desc: 'Cloud infrastructure', visibleForCategories: null),
      OptionItem(id: 'docker', label: 'Docker & K8s', icon: Icons.directions_boat, bgColor: Color(0xFFE1F5FE), borderColor: Color(0xFF42A5F5), price: 2499, desc: 'Container deployment', visibleForCategories: ['engineering', 'mtech', 'bca-mca', 'bsc-msc', 'phd', 'web-dev', 'cyber-sec', 'blockchain']),
      OptionItem(id: 'solidity', label: 'Solidity / Web3', icon: Icons.link, bgColor: Color(0xFFF3E5F5), borderColor: Color(0xFFAB47BC), price: 2999, desc: 'Smart Contracts', visibleForCategories: ['phd', 'blockchain']),

      OptionItem(id: 'tensorflow', label: 'TensorFlow/PyTorch', icon: Icons.psychology, bgColor: Color(0xFFFFEBEE), borderColor: Color(0xFFEF5350), price: 4999, desc: 'Deep learning', visibleForCategories: ['ai-ml', 'mtech', 'engineering', 'bca-mca', 'bsc-msc', 'phd']),
      OptionItem(id: 'pandas', label: 'Data Analysis', icon: Icons.analytics, bgColor: Color(0xFFE8F5E9), borderColor: Color(0xFF66BB6A), price: 1999, desc: 'Data & visualization', visibleForCategories: ['ai-ml', 'engineering', 'mtech', 'bca-mca', 'bsc-msc', 'phd', 'cyber-sec']),
    ],
  ),
  StepData(
    id: 'addons',
    title: 'Add-Ons',
    emoji: '✨',
    hint: 'Available as add-ons',
    type: 'multi',
    options: [
      OptionItem(id: 'ppt', label: 'PPT Presentation', icon: Icons.slideshow, bgColor: Color(0xFFFFF9C4), borderColor: Color(0xFFFFCA28), price: 499),
      OptionItem(id: 'report', label: 'Thesis Report', icon: Icons.description, bgColor: Color(0xFFE8F5E9), borderColor: Color(0xFF66BB6A), price: 999),
      OptionItem(id: 'viva', label: 'Viva Guidance Sheet', icon: Icons.menu_book, bgColor: Color(0xFFE1F5FE), borderColor: Color(0xFF42A5F5), price: 399),
      OptionItem(id: 'remote', label: 'Remote Setup', icon: Icons.verified_user, bgColor: Color(0xFFFFEBEE), borderColor: Color(0xFFEF5350), price: 699),
    ],
  ),
  StepData(
    id: 'timeline',
    title: 'Deadline',
    emoji: '⏱️',
    hint: 'Pick the closest deadline',
    type: 'single',
    options: [
      OptionItem(id: 'urgent', label: '1–3 Days', icon: Icons.bolt, bgColor: Color(0xFFFFEBEE), borderColor: Color(0xFFEF5350), price: 2499),
      OptionItem(id: 'normal', label: '4–7 Days', icon: Icons.schedule, bgColor: Color(0xFFFFF9C4), borderColor: Color(0xFFFFCA28), price: 999),
      OptionItem(id: 'relaxed', label: '8–14 Days', icon: Icons.check_circle, bgColor: Color(0xFFE8F5E9), borderColor: Color(0xFF66BB6A), price: 0),
      OptionItem(id: 'flexible', label: 'Flexible', icon: Icons.star, bgColor: Color(0xFFE1F5FE), borderColor: Color(0xFF42A5F5), price: 0),
    ],
  ),
];

class CustomizerScreen extends StatefulWidget {
  const CustomizerScreen({super.key});

  @override
  State<CustomizerScreen> createState() => _CustomizerScreenState();
}

class _CustomizerScreenState extends State<CustomizerScreen> {
  int currentStep = 0;
  bool showSummary = false;

  Map<String, dynamic> selections = {
    'category': null,
    'diploma_packages': null,
    'tech': <String>[],
    'addons': <String>[],
    'timeline': null,
  };

  List<StepData> get visibleSteps {
    List<StepData> visible = [];
    bool isDiploma = selections['category'] == 'diploma';
    bool isCustomSelected = selections['diploma_packages'] == 'custom';

    for (var step in stepsData) {
      if (step.id == 'diploma_packages') {
        if (isDiploma) visible.add(step);
      } else if (step.id == 'tech') {
        if (!isDiploma || isCustomSelected) visible.add(step);
      } else {
        visible.add(step);
      }
    }
    return visible;
  }

  int get totalAmount {
    int total = 0;
    bool isDiploma = selections['category'] == 'diploma';
    bool isCustom = selections['diploma_packages'] == 'custom';

    for (var step in visibleSteps) {
      if (step.type == 'single') {
        for (var opt in step.options) {
          if (opt.id == selections[step.id]) {
             if ((step.id == 'addons' || step.id == 'timeline' || step.id == 'tech') && isDiploma && !isCustom) {
                 total += opt.price ~/ 2;
             } else {
                 total += opt.price;
             }
          }
        }
      } else {
        final list = selections[step.id] as List<String>;
        for (var id in list) {
          for (var opt in step.options) {
            if (opt.id == id) {
             if ((step.id == 'addons' || step.id == 'timeline' || step.id == 'tech') && isDiploma && !isCustom) {
                 total += opt.price ~/ 2;
             } else {
                 total += opt.price;
             }
            }
          }
        }
      }
    }
    return total;
  }

  void handleToggle(String stepId, String optionId, String type) {
    setState(() {
      if (type == 'single') {
        if (stepId == 'category' && selections['category'] != optionId) {
          selections['diploma_packages'] = null;
          selections['tech'] = <String>[];
        }
        selections[stepId] = optionId;
      } else {
        final list = selections[stepId] as List<String>;
        if (list.contains(optionId)) {
          list.remove(optionId);
        } else {
          list.add(optionId);
        }
      }
    });
  }

  bool canProceed() {
    final step = visibleSteps[currentStep];
    if (step.type == 'single') {
      return selections[step.id] != null;
    } else {
      return true; // Optional multi-selects
    }
  }

  void handleNext() {
    setState(() {
      if (currentStep < visibleSteps.length - 1) {
        currentStep++;
      } else {
        showSummary = true;
      }
    });
  }

  void handleBack() {
    setState(() {
      if (showSummary) {
        showSummary = false;
      } else if (currentStep > 0) {
        currentStep--;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return GlassBackground(
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
        title: GestureDetector(
          onLongPress: () async {
            final LocalAuthentication auth = LocalAuthentication();
            bool authenticated = false;
            try {
              authenticated = await auth.authenticate(
                localizedReason: 'Please authenticate to access the Admin Panel',
                biometricOnly: true,
                persistAcrossBackgrounding: true,
              );
            } catch (e) {
              // Ignore or handle errors
              debugPrint('Auth error: $e');
            }

            if (authenticated && context.mounted) {
              Navigator.push(
                context,
                PageRouteBuilder(
                  pageBuilder: (context, animation, secondaryAnimation) => const AdminPanelScreen(),
                  transitionsBuilder: (context, animation, secondaryAnimation, child) {
                    return FadeTransition(
                      opacity: animation, 
                      child: ScaleTransition(
                        scale: Tween<double>(begin: 0.95, end: 1.0).animate(CurvedAnimation(parent: animation, curve: Curves.easeOutBack)), 
                        child: child
                      )
                    );
                  },
                  transitionDuration: const Duration(milliseconds: 600),
                ),
              ).then((_) {
                // Refresh state in case prices changed
                setState(() {});
              });
            }
          },
          child: const Text(
            'Project Customiser 🚀',
            style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF2C2C2C)),
          ).animate(onPlay: (controller) => controller.repeat()).shimmer(duration: 2.seconds, delay: 1.seconds),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.business_center, color: Color(0xFF2C2C2C)),
            tooltip: 'Commercial Mode',
            onPressed: () {
              Navigator.pushReplacement(
                context,
                PageRouteBuilder(
                  pageBuilder: (context, animation, secondaryAnimation) => const CommercialScreen(),
                  transitionsBuilder: (context, animation, secondaryAnimation, child) {
                    return FadeTransition(
                      opacity: animation, 
                      child: ScaleTransition(
                        scale: Tween<double>(begin: 1.05, end: 1.0).animate(CurvedAnimation(parent: animation, curve: Curves.easeOutCubic)), 
                        child: child
                      )
                    );
                  },
                  transitionDuration: const Duration(milliseconds: 500),
                ),
              );
            },
          ),
          IconButton(
            icon: const Text('💬', style: TextStyle(fontSize: 22)).animate(onPlay: (controller) => controller.repeat(reverse: true)).scale(begin: const Offset(1, 1), end: const Offset(1.2, 1.2), duration: 800.ms),
            onPressed: () {
              Navigator.push(
                context,
                PageRouteBuilder(
                  transitionDuration: const Duration(milliseconds: 600),
                  reverseTransitionDuration: const Duration(milliseconds: 400),
                  transitionsBuilder: (context, animation, secondaryAnimation, child) {
                    return SlideTransition(
                      position: Tween<Offset>(begin: const Offset(0, 1), end: Offset.zero)
                          .animate(CurvedAnimation(parent: animation, curve: Curves.easeOutExpo)),
                      child: child,
                    );
                  },
                  pageBuilder: (context, animation, secondaryAnimation) => ChatBotScreen(
                    contextData: _generateChatbotContext(),
                    apiKey: 'YOUR_API_KEY_HERE', // Replaced with placeholder for GitHub Push Protection
                    onSelectionsUpdated: (data) {
                      setState(() {
                        if (data['category'] != null) selections['category'] = data['category'];
                        if (data['diploma_packages'] != null) selections['diploma_packages'] = data['diploma_packages'];
                        if (data['tech'] != null) {
                          selections['tech'] = List<String>.from(data['tech']);
                        }
                        if (data['addons'] != null) {
                          selections['addons'] = List<String>.from(data['addons']);
                        }
                        if (data['timeline'] != null) selections['timeline'] = data['timeline'];
                      });
                    },
                  ),
                ),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          if (!showSummary) ...[
            LinearProgressIndicator(
              value: (currentStep + 1) / visibleSteps.length,
              backgroundColor: const Color(0xFFE0E0E0),
              color: const Color(0xFF2C2C2C),
              minHeight: 8,
            ),
            const SizedBox(height: 16),
          ],
          Expanded(
            child: showSummary ? _buildSummaryScreen() : _buildCurrentStep(),
          ),
          if (!showSummary) _buildFooter(),
        ],
      ),
    ));
  }

  String _generateChatbotContext() {
    String contextStr = 'Available Configuration Options (Use EXACTLY these IDs in your JSON tags):\n\n';
    
    for (var step in stepsData) {
      contextStr += '--- ${step.title} (Field: ${step.id}) ---\n';
      for (var opt in step.options) {
        contextStr += 'ID: "${opt.id}", Label: "${opt.label}"\n';
      }
      contextStr += '\n';
    }

    contextStr += 'Current User Selections so far:\n';
    contextStr += 'Category: ${_getDetailedLabel('category', selections['category'])}\n';
    if (selections['category'] == 'diploma') {
      contextStr += 'Diploma Package: ${_getDetailedLabel('diploma_packages', selections['diploma_packages'])}\n';
    }
    contextStr += 'Tech Stack: ${(selections['tech'] as List<String>).map((id) => _getDetailedLabel('tech', id)).join(', ')}\n';
    contextStr += 'Add-ons: ${(selections['addons'] as List<String>).map((id) => _getDetailedLabel('addons', id)).join(', ')}\n';
    contextStr += 'Timeline: ${_getDetailedLabel('timeline', selections['timeline'])}\n\n';
    
    return contextStr;
  }

  Widget _buildCurrentStep() {
    final step = visibleSteps[currentStep];
    final selectedCategory = selections['category'];
    final isDiploma = selectedCategory == 'diploma';

    final visibleOptions = step.options.where((opt) {
      if (step.id == 'tech' && selectedCategory == 'ui-ux') return false; // Hardcode UI/UX to skip/hide all tech stacks
      if (opt.visibleForCategories == null) return true;
      if (selectedCategory == null) return true;
      return opt.visibleForCategories!.contains(selectedCategory);
    }).toList();

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      children: [
        Row(
          children: [
            Text(step.emoji, style: const TextStyle(fontSize: 28))
                .animate(key: ValueKey(step.id)).fade(duration: 400.ms).scale(delay: 100.ms, duration: 400.ms, curve: Curves.easeOutBack),
            const SizedBox(width: 8),
            Text(
              step.title,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Color(0xFF2C2C2C)),
            ).animate(key: ValueKey('${step.id}_title')).fade(duration: 400.ms).slideX(begin: 0.1, duration: 400.ms, curve: Curves.easeOutQuad),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          step.hint,
          style: const TextStyle(fontSize: 14, color: Color(0xFF6A6A6A)),
        ),
        const SizedBox(height: 24),
        if (step.id == 'tech' && visibleOptions.isEmpty)
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFFE8F5E9),
              border: Border.all(color: const Color(0xFF2C2C2C), width: 3),
              borderRadius: BorderRadius.circular(16),
              boxShadow: const [BoxShadow(color: Color(0xFF66BB6A), offset: Offset(4, 4))],
            ),
            child: const Center(
              child: Text(
                'No specific tech stacks needed for this field. You can proceed to the next step!',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF2C2C2C)),
              ),
            ),
          )
        else
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              childAspectRatio: 0.85,
            ),
            itemCount: visibleOptions.length,
            itemBuilder: (context, index) {
              final opt = visibleOptions[index];
              bool isSelected = false;
              if (step.type == 'single') {
                isSelected = selections[step.id] == opt.id;
              } else {
                isSelected = (selections[step.id] as List<String>).contains(opt.id);
              }

            int displayPrice = opt.price;
            bool isCustom = selections['diploma_packages'] == 'custom';
            if ((step.id == 'addons' || step.id == 'timeline' || step.id == 'tech') && isDiploma && !isCustom) {
              displayPrice = opt.price ~/ 2;
            }

            String priceLabel = step.id == 'category'
                ? 'Starting at ₹$displayPrice'
                : displayPrice == 0
                    ? 'Free 🌿'
                    : '+ ₹$displayPrice';

            return GestureDetector(
              onTap: () => handleToggle(step.id, opt.id, step.type),
              child: GlassCard(
                isSelected: isSelected,
                baseColor: opt.bgColor,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(opt.icon, size: 32, color: const Color(0xFF2C2C2C)),
                    const SizedBox(height: 8),
                    Text(
                      opt.label,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF2C2C2C),
                      ),
                    ),
                    if (opt.desc != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        opt.desc!,
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 10, color: Color(0xFF6A6A6A)),
                      ),
                    ],
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFF2C2C2C) : const Color(0xFFF0F0F0),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        priceLabel,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: isSelected ? const Color(0xFFFFF59D) : const Color(0xFF5A5A5A),
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ),
          ).animate(key: ValueKey('${step.id}_${opt.id}'))
             .fade(duration: 300.ms, delay: (index * 50).ms)
             .slideY(begin: 0.2, end: 0, duration: 300.ms, curve: Curves.easeOutQuad, delay: (index * 50).ms);
          },
        ),
      ],
    );
  }

  Widget _buildFooter() {
    bool nextEnabled = canProceed();
    return GlassContainer(
      padding: const EdgeInsets.all(12),
      borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      child: SafeArea(
        child: Row(
          children: [
            if (currentStep > 0)
              IconButton(
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(minWidth: 40, minHeight: 40),
                onPressed: handleBack,
                icon: const Icon(Icons.arrow_back_ios_new, color: Color(0xFF2C2C2C)),
              )
            else
              const SizedBox(width: 40),
            const SizedBox(width: 4),
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFF2C2C2C),
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: const [BoxShadow(color: Color(0xFF66BB6A), offset: Offset(2, 3))],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Flexible(
                      child: Text(
                        'Total',
                        style: TextStyle(color: Color(0xFFA0A0A0), fontWeight: FontWeight.w900, fontSize: 12),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Flexible(
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        alignment: Alignment.centerRight,
                        child: Text(
                          selections['category'] != null ? '₹$totalAmount' : '—',
                          style: const TextStyle(color: Color(0xFFFFF59D), fontWeight: FontWeight.w900, fontSize: 16),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 12),
            ElevatedButton(
              onPressed: nextEnabled ? handleNext : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2C2C2C),
                foregroundColor: const Color(0xFFFAF6EE),
                disabledBackgroundColor: const Color(0xFFE0E0E0),
                disabledForegroundColor: const Color(0xFFA0A0A0),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                side: BorderSide(color: nextEnabled ? const Color(0xFF2C2C2C) : Colors.transparent, width: 2),
                elevation: nextEnabled ? 0 : 0,
              ).copyWith(
                shadowColor: WidgetStateProperty.all(Colors.transparent),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(currentStep == visibleSteps.length - 1 ? 'Summary' : 'Next', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
                  const SizedBox(width: 8),
                  Icon(currentStep == visibleSteps.length - 1 ? Icons.check_circle : Icons.chevron_right, size: 18).animate(onPlay: (controller) => controller.repeat(reverse: true)).slideX(begin: 0, end: 0.2, duration: 600.ms),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryScreen() {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Center(
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF59D).withAlpha(204),
              border: Border.all(color: const Color(0xFF2C2C2C), width: 2),
              borderRadius: BorderRadius.circular(8),
            ),
            // Rotate equivalent using Transform
            child: Transform.rotate(
              angle: -0.05,
              child: const Text('Your Custom Order Summary 📋', style: TextStyle(fontWeight: FontWeight.w900)),
            ),
          ),
        ).animate().fade(duration: 500.ms).scale(duration: 500.ms, curve: Curves.easeOutBack),
        const SizedBox(height: 24),
        GlassContainer(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('💰 PRICE BREAKDOWN', style: TextStyle(color: Color(0xFF2E7D32), fontWeight: FontWeight.w900, letterSpacing: 1.2)),
              const SizedBox(height: 16),
              _buildSummaryRow('Level', _getStepPrice('category'), '🎓'),
              if (selections['category'] == 'diploma') _buildSummaryRow('Package', _getStepPrice('diploma_packages'), '📦'),
              if (selections['category'] != 'diploma' || selections['diploma_packages'] == 'custom') _buildSummaryRow('Tech Stack', _getStepPrice('tech'), '⚙️'),
              _buildSummaryRow('Add-Ons', _getStepPrice('addons'), '✨'),
              _buildSummaryRow('Timeline', _getStepPrice('timeline'), '⏱️'),
              const Divider(color: Colors.black26, height: 32, thickness: 1),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Total Estimate', style: TextStyle(color: Color(0xFF2C2C2C), fontWeight: FontWeight.w900, fontSize: 16)),
                  Text('₹$totalAmount', style: const TextStyle(color: Color(0xFF2E7D32), fontWeight: FontWeight.w900, fontSize: 24)),
                ],
              ),
            ],
          ),
        ).animate().fade(duration: 500.ms, delay: 200.ms).slideY(begin: 0.1, duration: 500.ms, curve: Curves.easeOutQuad),
        const SizedBox(height: 32),
        ElevatedButton.icon(
          onPressed: _launchWhatsApp,
          icon: const Icon(Icons.chat),
          label: const Text('Send to WhatsApp & Get Quote', style: TextStyle(fontWeight: FontWeight.w900)),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFA5D6A7),
            foregroundColor: const Color(0xFF2C2C2C),
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            side: const BorderSide(color: Color(0xFF2C2C2C), width: 2),
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () {
                  _copyToClipboard(_generateSummaryText(), 'Quotation copied to clipboard!');
                },
                icon: const Icon(Icons.copy, size: 18),
                label: const Text('Copy Quote', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFFF59D),
                  foregroundColor: const Color(0xFF2C2C2C),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  side: const BorderSide(color: Color(0xFF2C2C2C), width: 2),
                  elevation: 0,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () {
                  _copyToClipboard(_generatePromptText(), 'Prompt copied to clipboard!');
                },
                icon: const Icon(Icons.auto_awesome, size: 18),
                label: const Text('Copy Prompt', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF3E5F5),
                  foregroundColor: const Color(0xFF2C2C2C),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  side: const BorderSide(color: Color(0xFF2C2C2C), width: 2),
                  elevation: 0,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: handleBack,
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  side: const BorderSide(color: Color(0xFF2C2C2C), width: 2),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('← Edit', style: TextStyle(color: Color(0xFF5A5A5A), fontWeight: FontWeight.w900)),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: OutlinedButton(
                onPressed: () {
                  setState(() {
                    currentStep = 0;
                    showSummary = false;
                    selections = {'category': null, 'diploma_packages': null, 'tech': <String>[], 'addons': <String>[], 'timeline': null};
                  });
                },
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  side: const BorderSide(color: Color(0xFF2C2C2C), width: 2),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('🔄 Start Over', style: TextStyle(color: Color(0xFF5A5A5A), fontWeight: FontWeight.w900)),
              ),
            ),
          ],
        ).animate().fade(duration: 500.ms, delay: 400.ms).slideY(begin: 0.1, duration: 500.ms, curve: Curves.easeOutQuad),
      ],
    );
  }

  Widget _buildSummaryRow(String label, int value, String icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text('$icon $label', style: const TextStyle(color: Color(0xFF2C2C2C), fontWeight: FontWeight.w900)),
          Text(value == 0 ? 'Free 🌿' : '₹$value', style: const TextStyle(color: Color(0xFF2C2C2C), fontWeight: FontWeight.w900)),
        ],
      ),
    );
  }

  int _getStepPrice(String stepId) {
    int price = 0;
    bool isDiploma = selections['category'] == 'diploma';
    bool isCustom = selections['diploma_packages'] == 'custom';
    final step = stepsData.firstWhere((s) => s.id == stepId, orElse: () => stepsData[0]);
    if (step.id != stepId) return 0;

    if (step.type == 'single') {
      for (var opt in step.options) {
        if (opt.id == selections[step.id]) {
          price += ((step.id == 'addons' || step.id == 'timeline' || step.id == 'tech') && isDiploma && !isCustom) ? opt.price ~/ 2 : opt.price;
        }
      }
    } else {
      final list = selections[step.id] as List<String>;
      for (var id in list) {
        for (var opt in step.options) {
          if (opt.id == id) {
            price += ((step.id == 'addons' || step.id == 'timeline' || step.id == 'tech') && isDiploma && !isCustom) ? opt.price ~/ 2 : opt.price;
          }
        }
      }
    }
    return price;
  }

  String _generateSummaryText() {
    bool isDiploma = selections['category'] == 'diploma';
    String categoryText = _getDetailedLabel('category', selections['category']);
    
    String packageText = '';
    if (isDiploma) {
      packageText = '\n📦 *Package*\n  🔹 ${_getDetailedLabel('diploma_packages', selections['diploma_packages'])}\n';
    }

    List<String> techTexts = [];
    if (!isDiploma || selections['diploma_packages'] == 'custom') {
      for (var id in (selections['tech'] as List<String>)) {
        techTexts.add(_getDetailedLabel('tech', id));
      }
    }

    List<String> addOnTexts = [];
    for (var id in (selections['addons'] as List<String>)) {
      addOnTexts.add(_getDetailedLabel('addons', id));
    }

    String timelineText = _getDetailedLabel('timeline', selections['timeline']);

    return '''
Hello from ShubDeep Labs! 👋✨

Here is your Custom Project Quotation:
━━━━━━━━━━━━━━━━━━━━━━

🎓 *Field / Domain*
  🔹 $categoryText
$packageText
⚙️ *Tech Stack*
${techTexts.isEmpty ? '  🔸 None' : techTexts.map((e) => '  🔸 $e').join('\n')}

✨ *Add-Ons*
${addOnTexts.isEmpty ? '  🔹 None' : addOnTexts.map((e) => '  🔹 $e').join('\n')}

⏱️ *Timeline*
  🔸 $timelineText

━━━━━━━━━━━━━━━━━━━━━━
💰 *Total Estimate*: ₹$totalAmount
━━━━━━━━━━━━━━━━━━━━━━

Let us know when you're ready to start building! 🚀👨‍💻
''';
  }

  String _generatePromptText() {
    bool isDiploma = selections['category'] == 'diploma';
    String categoryText = _getLabel('category', selections['category']);
    
    String packageText = '';
    if (isDiploma) {
      packageText = 'Package: ${_getLabel('diploma_packages', selections['diploma_packages'])}\n';
    }

    List<String> techTexts = [];
    if (!isDiploma || selections['diploma_packages'] == 'custom') {
      for (var id in (selections['tech'] as List<String>)) {
        techTexts.add(_getLabel('tech', id));
      }
    }

    List<String> addOnTexts = [];
    for (var id in (selections['addons'] as List<String>)) {
      addOnTexts.add(_getLabel('addons', id));
    }
    String timelineText = _getLabel('timeline', selections['timeline']);

    return '''
Act as a senior software engineer and project manager. I need to build a project with the following specifications:

Field/Domain: $categoryText
$packageText
Tech Stack: ${techTexts.isEmpty ? 'None' : techTexts.join(', ')}
Add-Ons required: ${addOnTexts.isEmpty ? 'None' : addOnTexts.join(', ')}
Timeline: $timelineText

Please provide a high-level architecture overview, a step-by-step development plan, and outline any potential challenges for building this project.
''';
  }

  String _getLabel(String stepId, dynamic id) {
    if (id == null) return 'None';
    final step = stepsData.firstWhere((s) => s.id == stepId, orElse: () => stepsData[0]);
    if (step.id != stepId) return '';
    for (var opt in step.options) {
      if (opt.id == id) return opt.label;
    }
    return '';
  }

  String _getDetailedLabel(String stepId, dynamic id) {
    if (id == null) return 'None';
    bool isDiploma = selections['category'] == 'diploma';
    bool isCustom = selections['diploma_packages'] == 'custom';
    final step = stepsData.firstWhere((s) => s.id == stepId, orElse: () => stepsData[0]);
    if (step.id != stepId) return '';
    for (var opt in step.options) {
      if (opt.id == id) {
        int displayPrice = opt.price;
        if ((stepId == 'addons' || stepId == 'timeline' || stepId == 'tech') && isDiploma && !isCustom) {
          displayPrice = displayPrice ~/ 2;
        }
        String priceStr = displayPrice == 0 ? 'Free' : '+₹$displayPrice';
        if (stepId == 'category') priceStr = displayPrice == 0 ? 'Free' : 'from ₹$displayPrice';
        String descStr = opt.desc != null ? ' - ${opt.desc}' : '';
        return '${opt.label} ($priceStr)$descStr';
      }
    }
    return '';
  }

  void _copyToClipboard(String text, String successMessage) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(successMessage, style: const TextStyle(fontWeight: FontWeight.w900)),
        backgroundColor: const Color(0xFF2C2C2C),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _launchWhatsApp() async {
    final text = _generateSummaryText();
    final encodedText = Uri.encodeComponent(text);
    // You can replace this number with your business WhatsApp number
    final url = Uri.parse('https://wa.me/919028833275?text=$encodedText'); 
    
    try {
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      } else {
        throw 'Could not launch WhatsApp';
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Could not open WhatsApp. Try copying the quote instead!', style: TextStyle(fontWeight: FontWeight.w900)),
            backgroundColor: const Color(0xFFEF5350),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          ),
        );
      }
    }
  }
}
