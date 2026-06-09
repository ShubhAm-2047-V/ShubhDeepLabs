import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'main.dart'; // To access stepsData
import 'commercial.dart'; // To access commercial opts
import 'glass_widgets.dart';

class AdminPanelScreen extends StatefulWidget {
  const AdminPanelScreen({super.key});

  @override
  State<AdminPanelScreen> createState() => _AdminPanelScreenState();
}

class _AdminPanelScreenState extends State<AdminPanelScreen> {
  final Map<String, TextEditingController> _studentControllers = {};
  final Map<String, TextEditingController> _commercialControllers = {};

  final List<List<dynamic>> _commCategories = [
    ['Core Platform', projectOpts, Icons.layers],
    ['App Architecture', appPlatformOpts, Icons.smartphone],
    ['Web Architecture', webPlatformOpts, Icons.language],
    ['App Features', appFeaturesOpts, Icons.apps],
    ['Web Features', webFeaturesOpts, Icons.web],
    ['Timeline', timelineOpts, Icons.schedule],
  ];

  @override
  void initState() {
    super.initState();
    for (var step in stepsData) {
      for (var opt in step.options) {
        _studentControllers[opt.id] = TextEditingController(text: opt.price.toString());
      }
    }
    for (var cat in _commCategories) {
      for (var opt in cat[1]) {
        _commercialControllers[opt.id] = TextEditingController(text: opt.price.toString());
      }
    }
  }

  @override
  void dispose() {
    for (var controller in _studentControllers.values) {
      controller.dispose();
    }
    for (var controller in _commercialControllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  Future<void> _savePrices() async {
    final prefs = await SharedPreferences.getInstance();
    
    // Save student
    for (var step in stepsData) {
      for (var opt in step.options) {
        final newPriceText = _studentControllers[opt.id]?.text ?? '0';
        final newPrice = int.tryParse(newPriceText) ?? 0;
        opt.price = newPrice;
        await prefs.setInt('price_${opt.id}', newPrice);
      }
    }

    // Save commercial
    for (var cat in _commCategories) {
      for (var opt in cat[1]) {
        final newPriceText = _commercialControllers[opt.id]?.text ?? '0';
        final newPrice = int.tryParse(newPriceText) ?? 0;
        opt.price = newPrice;
        await prefs.setInt('comm_price_${opt.id}', newPrice);
      }
    }

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Row(
            children: [
              Icon(Icons.check_circle, color: Colors.white),
              SizedBox(width: 12),
              Text('Pricing configuration saved!', style: TextStyle(fontWeight: FontWeight.bold)),
            ],
          ),
          backgroundColor: const Color(0xFF2E7D32),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          margin: const EdgeInsets.all(16),
        ),
      );
      Navigator.pop(context); 
    }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: GlassBackground(
        child: Scaffold(
          backgroundColor: Colors.transparent,
          appBar: AppBar(
            title: const Text('Admin Panel', style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF2C2C2C))),
            backgroundColor: Colors.transparent,
            elevation: 0,
            centerTitle: true,
            iconTheme: const IconThemeData(color: Color(0xFF2C2C2C)),
          bottom: const TabBar(
            labelColor: Color(0xFF2C2C2C),
            unselectedLabelColor: Colors.black54,
            indicatorColor: Color(0xFF2C2C2C),
            indicatorWeight: 4,
            labelStyle: TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
            tabs: [
              Tab(icon: Icon(Icons.school, size: 20), text: 'Student'),
              Tab(icon: Icon(Icons.business_center, size: 20), text: 'Commercial'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildStudentTab(),
            _buildCommercialTab(),
          ],
        ),
          bottomNavigationBar: _buildBottomBar(),
        ),
      ),
    );
  }

  Widget _buildStudentTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: stepsData.length,
      itemBuilder: (context, index) {
        final step = stepsData[index];
        return _buildExpansionSection(
          title: '${step.emoji} ${step.title}',
          options: step.options,
          controllers: _studentControllers,
          headerColor: const Color(0xFFF3E5F5),
        );
      },
    );
  }

  Widget _buildCommercialTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _commCategories.length,
      itemBuilder: (context, index) {
        final catName = _commCategories[index][0];
        final List<dynamic> catOpts = _commCategories[index][1];
        final IconData icon = _commCategories[index][2];

        return _buildExpansionSection(
          title: catName,
          icon: icon,
          options: catOpts,
          controllers: _commercialControllers,
          headerColor: const Color(0xFFE8F5E9),
        );
      },
    );
  }

  Widget _buildExpansionSection({
    required String title,
    IconData? icon,
    required List<dynamic> options,
    required Map<String, TextEditingController> controllers,
    required Color headerColor,
  }) {
    return GlassContainer(
      margin: const EdgeInsets.only(bottom: 16),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          collapsedIconColor: const Color(0xFF2C2C2C),
          iconColor: const Color(0xFF2C2C2C),
          title: Row(
            children: [
              if (icon != null) ...[
                Icon(icon, color: const Color(0xFF2C2C2C)),
                const SizedBox(width: 12),
              ],
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Color(0xFF2C2C2C)),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: headerColor,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF2C2C2C)),
                ),
                child: Text(
                  '${options.length} items',
                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF2C2C2C)),
                ),
              )
            ],
          ),
          children: [
            const Divider(color: Color(0xFF2C2C2C), height: 1, thickness: 2),
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: options.length,
              separatorBuilder: (context, index) => const Divider(color: Color(0xFFEEEEEE), height: 1),
              itemBuilder: (context, index) {
                final opt = options[index];
                return _buildPriceRow(opt.id, opt.label, opt.icon, opt.borderColor, controllers[opt.id]!);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPriceRow(String id, String label, IconData icon, Color iconColor, TextEditingController controller) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconColor.withAlpha(50),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: iconColor, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: Color(0xFF2C2C2C)),
            ),
          ),
          SizedBox(
            width: 120,
            child: TextField(
              controller: controller,
              keyboardType: const TextInputType.numberWithOptions(signed: true),
              style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
              decoration: InputDecoration(
                prefixText: '₹ ',
                prefixStyle: const TextStyle(color: Colors.black54, fontWeight: FontWeight.bold),
                filled: true,
                fillColor: const Color(0xFFF5F5F5),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: Color(0xFF2C2C2C), width: 2),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                isDense: true,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar() {
    return GlassContainer(
      padding: const EdgeInsets.all(16),
      borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      child: SafeArea(
        child: ElevatedButton(
          onPressed: _savePrices,
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF2C2C2C),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            elevation: 0,
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.save_rounded),
              SizedBox(width: 8),
              Text('SAVE CONFIGURATION', style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16, letterSpacing: 1.2)),
            ],
          ),
        ),
      ),
    );
  }
}
