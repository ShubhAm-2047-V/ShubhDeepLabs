import 'package:flutter_test/flutter_test.dart';
import 'package:shubdeep_calsi/main.dart';

void main() {
  testWidgets('Smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const ShubDeepCustomizerApp());
    expect(find.text('Project Customiser 🚀'), findsOneWidget);
  });
}
