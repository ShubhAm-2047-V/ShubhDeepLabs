import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class GlassBackground extends StatefulWidget {
  final Widget child;

  const GlassBackground({super.key, required this.child});

  @override
  State<GlassBackground> createState() => _GlassBackgroundState();
}

class _GlassBackgroundState extends State<GlassBackground> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Alignment> _topAlignmentAnimation;
  late Animation<Alignment> _bottomAlignmentAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 15))..repeat(reverse: true);
    _topAlignmentAnimation = Tween<Alignment>(
      begin: Alignment.topLeft,
      end: Alignment.topRight,
    ).animate(_controller);
    
    _bottomAlignmentAnimation = Tween<Alignment>(
      begin: Alignment.bottomRight,
      end: Alignment.bottomLeft,
    ).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        AnimatedBuilder(
          animation: _controller,
          builder: (context, _) {
            return Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: _topAlignmentAnimation.value,
                  end: _bottomAlignmentAnimation.value,
                  colors: const [
                    Color(0xFFFAF6EE), // Cream
                    Color(0xFFE8F5E9), // Mint Green
                    Color(0xFFE1F5FE), // Soft Blue
                    Color(0xFFFAF6EE), // Cream
                  ],
                ),
              ),
            );
          },
        ),
        // Mesh gradient effect circles (Optimized using RadialGradient instead of expensive BackdropFilter)
        Positioned(
          top: -100,
          left: -50,
          child: Container(
            width: 300,
            height: 300,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFFC8E6C9).withOpacity(0.8), // Primary Green
                  const Color(0xFFC8E6C9).withOpacity(0.0),
                ],
              ),
            ),
          ).animate(onPlay: (controller) => controller.repeat(reverse: true))
           .moveX(begin: -20, end: 50, duration: 8.seconds, curve: Curves.easeInOutSine)
           .moveY(begin: -20, end: 40, duration: 11.seconds, curve: Curves.easeInOutSine),
        ),
        Positioned(
          bottom: -50,
          right: -100,
          child: Container(
            width: 400,
            height: 400,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFFFFF9C4).withOpacity(0.8), // Soft yellow
                  const Color(0xFFFFF9C4).withOpacity(0.0),
                ],
              ),
            ),
          ).animate(onPlay: (controller) => controller.repeat(reverse: true))
           .moveX(begin: 30, end: -60, duration: 9.seconds, curve: Curves.easeInOutSine)
           .moveY(begin: 20, end: -50, duration: 13.seconds, curve: Curves.easeInOutSine),
        ),
        // Add a very subtle, lightweight overlay to tie colors together
        Container(color: Colors.white.withOpacity(0.2)),
        // The actual app content
        widget.child,
      ],
    );
  }
}

class GlassCard extends StatelessWidget {
  final Widget child;
  final bool isSelected;
  final Color baseColor;

  const GlassCard({
    super.key,
    required this.child,
    this.isSelected = false,
    required this.baseColor,
  });

  @override
  Widget build(BuildContext context) {
    Widget card = Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        boxShadow: isSelected
            ? [
                BoxShadow(color: const Color(0xFF2C2C2C).withOpacity(0.15), offset: const Offset(4, 8), blurRadius: 16),
              ]
            : [
                BoxShadow(color: Colors.black.withOpacity(0.05), offset: const Offset(2, 6), blurRadius: 12),
              ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 16.0, sigmaY: 16.0),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: isSelected 
                    ? [baseColor.withOpacity(0.6), baseColor.withOpacity(0.2)]
                    : [Colors.white.withOpacity(0.5), Colors.white.withOpacity(0.1)],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isSelected ? const Color(0xFF2C2C2C).withOpacity(0.5) : Colors.white.withOpacity(0.7),
                width: isSelected ? 2 : 1,
              ),
            ),
            child: child,
          ),
        ),
      ),
    );

    if (isSelected) {
      card = card.animate(target: isSelected ? 1 : 0)
        .scaleXY(end: 1.05, duration: 150.ms, curve: Curves.easeOutBack)
        .shimmer(duration: 1000.ms, color: Colors.white.withOpacity(0.4));
    }

    return card;
  }
}

class GlassContainer extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BorderRadiusGeometry? borderRadius;

  const GlassContainer({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    final br = borderRadius ?? BorderRadius.circular(16);
    return Container(
      margin: margin,
      decoration: BoxDecoration(
        borderRadius: br,
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 16, offset: const Offset(0, -4)),
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 16, offset: const Offset(0, 4)),
        ],
      ),
      child: ClipRRect(
        borderRadius: br,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20.0, sigmaY: 20.0),
          child: Container(
            padding: padding,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Colors.white.withOpacity(0.7), Colors.white.withOpacity(0.2)],
              ),
              borderRadius: br,
              border: Border.all(color: Colors.white.withOpacity(0.8), width: 1.5),
            ),
            child: child,
          ),
        ),
      ),
    );
  }
}
