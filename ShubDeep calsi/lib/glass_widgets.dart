import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class GlassBackground extends StatelessWidget {
  final Widget child;

  const GlassBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Static smooth background gradient
        Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFFFAF6EE), // Cream
                Color(0xFFE8F5E9), // Mint Green
                Color(0xFFE1F5FE), // Soft Blue
                Color(0xFFFAF6EE), // Cream
              ],
            ),
          ),
        ),
        // Static decorative mesh gradients
        Positioned(
          top: -50,
          left: -50,
          child: Container(
            width: 350,
            height: 350,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFFC8E6C9).withOpacity(0.5),
                  const Color(0xFFC8E6C9).withOpacity(0.0),
                ],
              ),
            ),
          ),
        ),
        Positioned(
          bottom: -50,
          right: -50,
          child: Container(
            width: 400,
            height: 400,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFFFFF9C4).withOpacity(0.5),
                  const Color(0xFFFFF9C4).withOpacity(0.0),
                ],
              ),
            ),
          ),
        ),
        // The actual app content
        child,
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

  Widget build(BuildContext context) {
    final card = AnimatedContainer(
      duration: const Duration(milliseconds: 150),
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
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: isSelected 
                  ? [baseColor.withOpacity(0.8), baseColor.withOpacity(0.5)]
                  : [Colors.white.withOpacity(0.9), Colors.white.withOpacity(0.6)],
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected ? const Color(0xFF2C2C2C).withOpacity(0.5) : Colors.white.withOpacity(0.9),
              width: isSelected ? 2 : 1,
            ),
          ),
          child: child,
        ),
      ),
    );

    return AnimatedScale(
      scale: isSelected ? 1.05 : 1.0,
      duration: const Duration(milliseconds: 150),
      curve: Curves.easeOutBack,
      child: card,
    );
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
        child: Container(
          padding: padding,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Colors.white.withOpacity(0.9), Colors.white.withOpacity(0.6)],
            ),
            borderRadius: br,
            border: Border.all(color: Colors.white.withOpacity(0.9), width: 1.5),
          ),
          child: child,
        ),
      ),
    );
  }
}
