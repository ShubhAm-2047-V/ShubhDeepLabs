import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'main.dart'; 
import 'glass_widgets.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Global Data for Commercial Mode
final List<_Opt> projectOpts = [
  _Opt('app', 'Mobile App', Icons.smartphone, const Color(0xFFE1F5FE), const Color(0xFF42A5F5), 'Native or Cross-platform', 49999),
  _Opt('website', 'Website / Web App', Icons.language, const Color(0xFFFFF9C4), const Color(0xFFFFCA28), 'SaaS, E-commerce, Portals', 29999),
];

final List<_Opt> appPlatformOpts = [
  _Opt('android', 'Android Only', Icons.android, const Color(0xFFE8F5E9), const Color(0xFF66BB6A), 'Play Store', 19999),
  _Opt('ios', 'iOS Only', Icons.apple, const Color(0xFFF3E5F5), const Color(0xFFAB47BC), 'App Store', 24999),
  _Opt('both', 'Cross-Platform', Icons.layers, const Color(0xFFE1F5FE), const Color(0xFF42A5F5), 'Flutter / React Native', 39999),
];

final List<_Opt> webPlatformOpts = [
  _Opt('ecommerce', 'E-Commerce', Icons.shopping_cart, const Color(0xFFFFEBEE), const Color(0xFFEF5350), 'Online Store', 39999),
  _Opt('saas', 'SaaS Platform', Icons.cloud, const Color(0xFFE1F5FE), const Color(0xFF42A5F5), 'Software as a Service', 79999),
  _Opt('dashboard', 'Admin Dashboard', Icons.dashboard, const Color(0xFFE8F5E9), const Color(0xFF66BB6A), 'Internal Tools', 44999),
  _Opt('landing', 'Landing Page', Icons.web, const Color(0xFFFFF9C4), const Color(0xFFFFCA28), 'Marketing Site', 14999),
];

final List<_Opt> appFeaturesOpts = [
  _Opt('auth', 'User Auth', Icons.lock, const Color(0xFFFFF9C4), const Color(0xFFFFCA28), 'Email/Password Login', 4999),
  _Opt('social_auth', 'Social Login', Icons.group, const Color(0xFFE8F5E9), const Color(0xFF66BB6A), 'Google, Apple, Facebook', 9999),
  _Opt('otp_verify', 'OTP Verification', Icons.pin, const Color(0xFFE1F5FE), const Color(0xFF42A5F5), 'SMS / WhatsApp OTP', 7999),
  _Opt('biometrics', 'Biometric Login', Icons.fingerprint, const Color(0xFFF3E5F5), const Color(0xFFAB47BC), 'FaceID / TouchID', 12999),
  _Opt('payment', 'Payments', Icons.payment, const Color(0xFFFFEBEE), const Color(0xFFEF5350), 'Stripe/Razorpay', 14999),
  _Opt('iap', 'In-App Purchases', Icons.shopping_bag, const Color(0xFFFFF9C4), const Color(0xFFFFCA28), 'Subscriptions & IAP', 24999),
  _Opt('push', 'Push Notifications', Icons.notifications, const Color(0xFFE8F5E9), const Color(0xFF66BB6A), 'FCM/APNs Alerts', 9999),
  _Opt('chat', 'Live Chat', Icons.chat, const Color(0xFFE1F5FE), const Color(0xFF42A5F5), 'Real-time messaging', 29999),
  _Opt('video_call', 'Video/Voice Call', Icons.video_call, const Color(0xFFF3E5F5), const Color(0xFFAB47BC), 'WebRTC / Agora', 39999),
  _Opt('maps', 'Maps & Routing', Icons.map, const Color(0xFFFFEBEE), const Color(0xFFEF5350), 'GPS & Live Tracking', 24999),
  _Opt('qr_scanner', 'QR/Barcode', Icons.qr_code_scanner, const Color(0xFFFFF9C4), const Color(0xFFFFCA28), 'Built-in scanner', 9999),
  _Opt('bluetooth', 'Bluetooth/IoT', Icons.bluetooth, const Color(0xFFE8F5E9), const Color(0xFF66BB6A), 'BLE & Hardware APIs', 34999),
  _Opt('health', 'Health SDKs', Icons.favorite, const Color(0xFFE1F5FE), const Color(0xFF42A5F5), 'HealthKit/Google Fit', 34999),
  _Opt('file_upload', 'Media Uploads', Icons.cloud_upload, const Color(0xFFF3E5F5), const Color(0xFFAB47BC), 'AWS S3/Cloudinary', 12999),
  _Opt('pdf_gen', 'PDF Reports', Icons.picture_as_pdf, const Color(0xFFFFEBEE), const Color(0xFFEF5350), 'Generate & Export Docs', 14999),
  _Opt('gamification', 'Gamification', Icons.sports_esports, const Color(0xFFFFF9C4), const Color(0xFFFFCA28), 'Badges, Streaks & Points', 24999),
  _Opt('offline', 'Offline Mode', Icons.wifi_off, const Color(0xFFE8F5E9), const Color(0xFF66BB6A), 'Local DB Sync (SQLite)', 29999),
  _Opt('dark_mode', 'Dark Mode', Icons.dark_mode, const Color(0xFFE1F5FE), const Color(0xFF42A5F5), 'Dynamic Theme Support', 9999),
  _Opt('multi_lang', 'Multi-Language', Icons.translate, const Color(0xFFF3E5F5), const Color(0xFFAB47BC), 'i18n Localization', 19999),
  _Opt('deep_link', 'Deep Linking', Icons.link, const Color(0xFFFFEBEE), const Color(0xFFEF5350), 'Universal Links', 9999),
  _Opt('analytics', 'Analytics SDK', Icons.analytics, const Color(0xFFFFF9C4), const Color(0xFFFFCA28), 'Firebase / Mixpanel', 7999),
  _Opt('crm', 'CRM Integration', Icons.contacts, const Color(0xFFE8F5E9), const Color(0xFF66BB6A), 'Salesforce/HubSpot', 34999),
  _Opt('camera', 'Advanced Camera', Icons.camera_alt, const Color(0xFFE1F5FE), const Color(0xFF42A5F5), 'Custom UI/AR Elements', 49999),
];

final List<_Opt> webFeaturesOpts = [
  _Opt('auth', 'User Auth', Icons.lock, const Color(0xFFFFF9C4), const Color(0xFFFFCA28), 'Email/Password Login', 4999),
  _Opt('sso', 'Enterprise SSO', Icons.vpn_key, const Color(0xFFE8F5E9), const Color(0xFF66BB6A), 'SAML / OAuth', 29999),
  _Opt('rbac', 'Role-based Access', Icons.manage_accounts, const Color(0xFFE1F5FE), const Color(0xFF42A5F5), 'Complex Permissions', 24999),
  _Opt('payment', 'Payment Gateway', Icons.payment, const Color(0xFFF3E5F5), const Color(0xFFAB47BC), 'Stripe/Razorpay', 14999),
  _Opt('subscriptions', 'Recurring Billing', Icons.autorenew, const Color(0xFFFFEBEE), const Color(0xFFEF5350), 'SaaS Subscriptions', 29999),
  _Opt('multi_currency', 'Multi-Currency', Icons.currency_exchange, const Color(0xFFFFF9C4), const Color(0xFFFFCA28), 'Dynamic local pricing', 19999),
  _Opt('cms', 'Admin CMS', Icons.admin_panel_settings, const Color(0xFFE8F5E9), const Color(0xFF66BB6A), 'Content Management', 34999),
  _Opt('seo', 'Advanced SEO', Icons.search, const Color(0xFFE1F5FE), const Color(0xFF42A5F5), 'Meta, Schema, Sitemap', 19999),
  _Opt('ai', 'AI Integration', Icons.psychology, const Color(0xFFF3E5F5), const Color(0xFFAB47BC), 'OpenAI APIs', 39999),
  _Opt('advanced_search', 'Algolia Search', Icons.manage_search, const Color(0xFFFFEBEE), const Color(0xFFEF5350), 'Lightning fast indexing', 24999),
  _Opt('chat', 'Support Chatbot', Icons.support_agent, const Color(0xFFFFF9C4), const Color(0xFFFFCA28), 'AI/Live Agent Support', 14999),
  _Opt('analytics', 'Analytics Dash', Icons.analytics, const Color(0xFFE8F5E9), const Color(0xFF66BB6A), 'Custom Dashboards', 44999),
  _Opt('pwa', 'PWA Support', Icons.install_mobile, const Color(0xFFE1F5FE), const Color(0xFF42A5F5), 'Installable Web App', 19999),
  _Opt('multi_tenant', 'Multi-Tenant', Icons.business, const Color(0xFFF3E5F5), const Color(0xFFAB47BC), 'SaaS Architecture', 59999),
  _Opt('webhooks', 'Webhooks & APIs', Icons.webhook, const Color(0xFFFFEBEE), const Color(0xFFEF5350), 'Expose APIs to clients', 34999),
  _Opt('api', '3rd Party APIs', Icons.api, const Color(0xFFFFF9C4), const Color(0xFFFFCA28), 'Zapier, Hubspot, etc.', 24999),
  _Opt('websockets', 'WebSockets', Icons.sync_alt, const Color(0xFFE8F5E9), const Color(0xFF66BB6A), 'Real-time Live Data', 29999),
  _Opt('email', 'Email Marketing', Icons.mail, const Color(0xFFE1F5FE), const Color(0xFF42A5F5), 'Mailchimp / Sendgrid', 11999),
  _Opt('inventory', 'Inventory/WMS', Icons.inventory, const Color(0xFFF3E5F5), const Color(0xFFAB47BC), 'Warehouse Management', 49999),
  _Opt('affiliate', 'Referral System', Icons.people_outline, const Color(0xFFFFEBEE), const Color(0xFFEF5350), 'Affiliate tracking', 29999),
  _Opt('gdpr', 'GDPR Compliance', Icons.policy, const Color(0xFFFFF9C4), const Color(0xFFFFCA28), 'Cookie consent, export', 14999),
  _Opt('backups', 'Auto Backups', Icons.backup, const Color(0xFFE8F5E9), const Color(0xFF66BB6A), 'Automated DB snapshots', 9999),
  _Opt('blog', 'Blog / News', Icons.article, const Color(0xFFE1F5FE), const Color(0xFF42A5F5), 'Content Marketing Hub', 24999),
];

final List<_Opt> timelineOpts = [
  _Opt('urgent', '1-2 Weeks', Icons.bolt, const Color(0xFFFFEBEE), const Color(0xFFEF5350), 'MVP Fast Track (Rush Fee)', 39999),
  _Opt('standard', '3-4 Weeks', Icons.schedule, const Color(0xFFFFF9C4), const Color(0xFFFFCA28), 'Standard Dev', 0),
  _Opt('relaxed', '1-2 Months', Icons.calendar_month, const Color(0xFFE8F5E9), const Color(0xFF66BB6A), 'Full Scale (Discount)', -15000),
  _Opt('flexible', 'Flexible', Icons.all_inclusive, const Color(0xFFE1F5FE), const Color(0xFF42A5F5), 'No rush', 0),
];

Future<void> loadCommercialPrices() async {
  final prefs = await SharedPreferences.getInstance();
  final allLists = [projectOpts, appPlatformOpts, webPlatformOpts, appFeaturesOpts, webFeaturesOpts, timelineOpts];
  for (var list in allLists) {
    for (var opt in list) {
      if (prefs.containsKey('comm_price_${opt.id}')) {
        opt.price = prefs.getInt('comm_price_${opt.id}') ?? opt.price;
      }
    }
  }
}

class CommercialScreen extends StatefulWidget {
  const CommercialScreen({super.key});

  @override
  State<CommercialScreen> createState() => _CommercialScreenState();
}

class _CommercialScreenState extends State<CommercialScreen> {
  int currentStep = 0;
  bool showSummary = false;

  // Selections
  String? projectType; // 'app' or 'website'
  String? platform; 
  List<String> features = [];
  String? timeline;

  int get totalAmount {
    int total = 0;
    
    // Step 0
    if (projectType != null) {
      final opt = projectOpts.firstWhere((o) => o.id == projectType);
      total += opt.price;
    }

    // Step 1
    if (platform != null) {
      List<_Opt> list = projectType == 'app' ? appPlatformOpts : webPlatformOpts;
      final opt = list.firstWhere((o) => o.id == platform);
      total += opt.price;
    }

    // Step 2
    List<_Opt> featsList = projectType == 'app' ? appFeaturesOpts : webFeaturesOpts;
    for (var f in features) {
      final opt = featsList.firstWhere((o) => o.id == f);
      total += opt.price;
    }

    // Step 3
    if (timeline != null) {
      final opt = timelineOpts.firstWhere((o) => o.id == timeline);
      total += opt.price;
    }

    return total;
  }

  void handleSelect(String stepId, String value) {
    setState(() {
      if (stepId == 'projectType') {
        if (projectType != value) {
          platform = null;
          features = [];
          timeline = null;
        }
        projectType = value;
      } else if (stepId == 'platform') {
        platform = value;
      } else if (stepId == 'timeline') {
        timeline = value;
      }
    });
  }

  void toggleFeature(String feature) {
    setState(() {
      if (features.contains(feature)) {
        features.remove(feature);
      } else {
        features.add(feature);
      }
    });
  }

  bool canProceed() {
    if (currentStep == 0) return projectType != null;
    if (currentStep == 1) return platform != null;
    if (currentStep == 2) return true; // Features optional
    if (currentStep == 3) return timeline != null;
    return true;
  }

  void handleNext() {
    setState(() {
      if (currentStep < 3) {
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
          title: const Text(
            'Commercial Customiser 💼',
            style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF2C2C2C)),
          ),
          backgroundColor: Colors.transparent,
          elevation: 0,
          centerTitle: true,
          actions: [
          IconButton(
            icon: const Icon(Icons.school, color: Color(0xFF2C2C2C)),
            tooltip: 'Switch to Student Mode',
            onPressed: () {
              Navigator.pushReplacement(
                context,
                PageRouteBuilder(
                  pageBuilder: (context, animation, secondaryAnimation) => const CustomizerScreen(),
                  transitionsBuilder: (context, animation, secondaryAnimation, child) {
                    return FadeTransition(
                      opacity: animation, 
                      child: ScaleTransition(
                        scale: Tween<double>(begin: 0.95, end: 1.0).animate(CurvedAnimation(parent: animation, curve: Curves.easeOutCubic)), 
                        child: child
                      )
                    );
                  },
                  transitionDuration: const Duration(milliseconds: 500),
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
              value: (currentStep + 1) / 4,
              backgroundColor: const Color(0xFFE0E0E0),
              color: const Color(0xFF2E7D32),
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

  Widget _buildCurrentStep() {
    String title = '';
    String hint = '';
    String emoji = '';
    Widget content = const SizedBox();

    if (currentStep == 0) {
      title = 'What are we building?';
      hint = 'Select the core platform for your business';
      emoji = '🏗️';
      content = _buildOptionsGrid(
        options: projectOpts,
        selectedId: projectType,
        onSelect: (id) => handleSelect('projectType', id),
        isMulti: false,
      );
    } else if (currentStep == 1) {
      if (projectType == 'app') {
        title = 'Choose OS Platform';
        hint = 'Where will your users download the app?';
        emoji = '📱';
        content = _buildOptionsGrid(
          options: appPlatformOpts,
          selectedId: platform,
          onSelect: (id) => handleSelect('platform', id),
          isMulti: false,
        );
      } else {
        title = 'Choose Web Solution';
        hint = 'What kind of web application is this?';
        emoji = '🌐';
        content = _buildOptionsGrid(
          options: webPlatformOpts,
          selectedId: platform,
          onSelect: (id) => handleSelect('platform', id),
          isMulti: false,
        );
      }
    } else if (currentStep == 2) {
      title = 'Key Features Required';
      hint = 'Select all the integrations you need';
      emoji = '✨';
      content = _buildOptionsGrid(
        options: projectType == 'app' ? appFeaturesOpts : webFeaturesOpts,
        selectedIds: features,
        onSelect: toggleFeature,
        isMulti: true,
      );
    } else if (currentStep == 3) {
      title = 'Timeline';
      hint = 'When do you need this launched?';
      emoji = '⏱️';
      content = _buildOptionsGrid(
        options: timelineOpts,
        selectedId: timeline,
        onSelect: (id) => handleSelect('timeline', id),
        isMulti: false,
      );
    }

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      children: [
        Row(
          children: [
            Text(emoji, style: const TextStyle(fontSize: 28)).animate(key: ValueKey(currentStep)).fade().scale(),
            const SizedBox(width: 8),
            Text(
              title,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Color(0xFF2C2C2C)),
            ).animate(key: ValueKey('${currentStep}_title')).fade().slideX(begin: 0.1),
          ],
        ),
        const SizedBox(height: 4),
        Text(hint, style: const TextStyle(fontSize: 14, color: Color(0xFF6A6A6A))),
        const SizedBox(height: 24),
        content,
      ],
    );
  }

  Widget _buildOptionsGrid({
    required List<_Opt> options,
    String? selectedId,
    List<String>? selectedIds,
    required Function(String) onSelect,
    required bool isMulti,
  }) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 0.72, // Adjusted for price tag
      ),
      itemCount: options.length,
      itemBuilder: (context, index) {
        final opt = options[index];
        bool isSelected = isMulti ? selectedIds!.contains(opt.id) : selectedId == opt.id;

        String priceLabel = currentStep == 0 
            ? 'from ₹${opt.price}' 
            : opt.price > 0 ? '+ ₹${opt.price}' : opt.price < 0 ? '- ₹${opt.price.abs()}' : 'Free';

        return GestureDetector(
          onTap: () => onSelect(opt.id),
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
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF2C2C2C)),
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
        ).animate(key: ValueKey('${currentStep}_${opt.id}')).fade(delay: (index * 50).ms).slideY(begin: 0.2, end: 0, delay: (index * 50).ms);
      },
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
                  boxShadow: const [BoxShadow(color: Color(0xFF81C784), offset: Offset(2, 3))],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Flexible(
                      child: Text(
                        'Estimate',
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
                          projectType != null ? '₹$totalAmount' : '—',
                          style: const TextStyle(color: Color(0xFFC8E6C9), fontWeight: FontWeight.w900, fontSize: 16),
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
                elevation: 0,
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(currentStep == 3 ? 'Summary' : 'Next', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16)),
                  const SizedBox(width: 8),
                  Icon(currentStep == 3 ? Icons.check_circle : Icons.chevron_right, size: 18),
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
              color: const Color(0xFFC8E6C9).withAlpha(204),
              border: Border.all(color: const Color(0xFF2C2C2C), width: 2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Transform.rotate(
              angle: -0.05,
              child: const Text('Commercial Quote 📋', style: TextStyle(fontWeight: FontWeight.w900)),
            ),
          ),
        ).animate().fade().scale(),
        const SizedBox(height: 24),
        GlassContainer(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('💰 COST BREAKDOWN', style: TextStyle(color: Color(0xFF2E7D32), fontWeight: FontWeight.w900, letterSpacing: 1.2)),
              const SizedBox(height: 16),
              _buildSummaryRow('Base Engine', projectType?.toUpperCase() ?? '', '🏗️', _getPrice(0)),
              _buildSummaryRow('Architecture', platform?.toUpperCase() ?? '', '🖥️', _getPrice(1)),
              _buildSummaryRow('Features', features.isEmpty ? 'None' : '${features.length} selected', '✨', _getPrice(2)),
              _buildSummaryRow('Timeline', timeline?.toUpperCase() ?? '', '⏱️', _getPrice(3)),
              const Divider(color: Colors.black26, height: 32, thickness: 1),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Total Estimate', style: TextStyle(color: Color(0xFF2C2C2C), fontWeight: FontWeight.w900, fontSize: 16)),
                  Text('₹$totalAmount', style: const TextStyle(color: Color(0xFF2E7D32), fontWeight: FontWeight.w900, fontSize: 24)),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                'Estimates are indicative and subject to change upon detailed discovery.',
                style: TextStyle(color: Color(0xFF6A6A6A), fontSize: 11),
              )
            ],
          ),
        ).animate().fade(delay: 200.ms).slideY(begin: 0.1),
        const SizedBox(height: 32),
        ElevatedButton.icon(
          onPressed: _launchWhatsApp,
          icon: const Icon(Icons.chat),
          label: const Text('Connect for Consultation', style: TextStyle(fontWeight: FontWeight.w900)),
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFA5D6A7),
            foregroundColor: const Color(0xFF2C2C2C),
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            side: const BorderSide(color: Color(0xFF2C2C2C), width: 2),
          ),
        ),
        const SizedBox(height: 16),
        OutlinedButton(
          onPressed: handleBack,
          style: OutlinedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 16),
            side: const BorderSide(color: Color(0xFF2C2C2C), width: 2),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          child: const Text('← Edit Requirements', style: TextStyle(color: Color(0xFF5A5A5A), fontWeight: FontWeight.w900)),
        ),
      ],
    );
  }

  void _launchWhatsApp() async {
    final pt = projectType != null ? projectOpts.firstWhere((o) => o.id == projectType).label : "—";
    final plList = projectType == 'app' ? appPlatformOpts : webPlatformOpts;
    final pl = platform != null ? plList.firstWhere((o) => o.id == platform).label : "—";
    final featList = projectType == 'app' ? appFeaturesOpts : webFeaturesOpts;
    final feats = features.isNotEmpty ? features.map((f) => featList.firstWhere((o) => o.id == f).label).join(', ') : "None";
    final tl = timeline != null ? timelineOpts.firstWhere((o) => o.id == timeline).label : "—";

    final text = 'Hello ShubDeep Labs! 👋\n\nI used your Commercial Customizer and here is my requirement:\n\n💼 Project Type: $pt\n📱 Platform: $pl\n✨ Features: $feats\n⏱️ Timeline: $tl\n💰 My Estimate: ₹$totalAmount\n\nPlease confirm the final quote for my commercial project!';
    final encodedText = Uri.encodeComponent(text);
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
            content: const Text('Could not open WhatsApp.', style: TextStyle(fontWeight: FontWeight.w900)),
            backgroundColor: const Color(0xFFEF5350),
          ),
        );
      }
    }
  }

  int _getPrice(int step) {
    int p = 0;
    if (step == 0 && projectType != null) {
      p = projectOpts.firstWhere((o) => o.id == projectType).price;
    } else if (step == 1 && platform != null) {
      List<_Opt> list = projectType == 'app' ? appPlatformOpts : webPlatformOpts;
      p = list.firstWhere((o) => o.id == platform).price;
    } else if (step == 2) {
      List<_Opt> list = projectType == 'app' ? appFeaturesOpts : webFeaturesOpts;
      for (var f in features) {
        p += list.firstWhere((o) => o.id == f).price;
      }
    } else if (step == 3 && timeline != null) {
      p = timelineOpts.firstWhere((o) => o.id == timeline).price;
    }
    return p;
  }

  Widget _buildSummaryRow(String label, String value, String icon, int price) {
    String priceStr = price > 0 ? '+ ₹$price' : price < 0 ? '- ₹${price.abs()}' : 'Free';
    
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('$icon ', style: const TextStyle(fontSize: 14)),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(color: Color(0xFFA0A0A0), fontSize: 12, fontWeight: FontWeight.bold)),
                Text(value, style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w900)),
              ],
            ),
          ),
          Text(priceStr, style: const TextStyle(color: Color(0xFF81C784), fontSize: 14, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}

class _Opt {
  final String id;
  final String label;
  final IconData icon;
  final Color bgColor;
  final Color borderColor;
  final String? desc;
  int price;

  _Opt(this.id, this.label, this.icon, this.bgColor, this.borderColor, this.desc, this.price);
}
