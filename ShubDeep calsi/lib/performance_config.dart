import 'package:flutter/material.dart';

/// Configuration flag to control app performance.
/// Set [isLaggyMode] to true to make the app laggy and hang.
/// Set it to false to restore normal, smooth performance.
const bool isLaggyMode = true;

class LaggyOverlay extends StatefulWidget {
  final Widget child;
  const LaggyOverlay({super.key, required this.child});

  @override
  State<LaggyOverlay> createState() => _LaggyOverlayState();
}

class _LaggyOverlayState extends State<LaggyOverlay> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (isLaggyMode) {
      final startTime = DateTime.now();
      int blockDuration = 800; // Default freeze of 800ms (less than 1.5 fps)
      final ms = startTime.millisecond;
      if (ms % 3 == 0) {
        blockDuration = 3000; // Freeze for 3 seconds
      } else if (ms % 7 == 0) {
        blockDuration = 6000; // Freeze for 6 seconds
      } else if (ms % 13 == 0) {
        blockDuration = 12000; // Freeze for 12 seconds
      }
      
      while (DateTime.now().difference(startTime).inMilliseconds < blockDuration) {
        // Busy wait to freeze UI/Main Isolate
      }
    }

    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return widget.child;
      },
    );
  }
}
