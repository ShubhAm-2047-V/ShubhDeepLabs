import 'package:flutter/material.dart';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'dart:async';
import 'dart:convert';
import 'package:flutter_animate/flutter_animate.dart';
import 'glass_widgets.dart';

class ChatMessage {
  final String text;
  final bool isUser;
  ChatMessage({required this.text, required this.isUser});
}

class ChatBotScreen extends StatefulWidget {
  final String contextData;
  final String apiKey;
  final void Function(Map<String, dynamic>)? onSelectionsUpdated;

  const ChatBotScreen({super.key, required this.contextData, required this.apiKey, this.onSelectionsUpdated});

  @override
  State<ChatBotScreen> createState() => _ChatBotScreenState();
}

class _ChatBotScreenState extends State<ChatBotScreen> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];
  
  bool _isLoading = false;
  String _loadingText = "AI is thinking...";
  
  late GenerativeModel _model;
  late ChatSession _chat;
  late String _initialPrompt;
  String _activeModelName = '';

  @override
  void initState() {
    super.initState();
    _initialPrompt = 'System Context: You are a helpful project manager and software engineering expert for ShubDeep Labs.\n'
        'Your job is to help the user pick their Tech Stack, Add-Ons, and Timeline for their custom project.\n'
        'You should answer their questions and recommend stacks based on their needs.\n'
        'Keep answers concise, friendly, and formatted nicely.\n\n'
        'IMPORTANT RULE: When you recommend a specific set of technologies or when the user makes a clear choice, you MUST append a JSON tag at the very end of your response to auto-select those options in the app UI. '
        'The tag MUST be strictly formatted like this: [CUSTOMIZER: {"category": "engineering", "tech": ["react", "nodejs"], "addons": ["ppt"], "timeline": "normal"}]\n'
        'Only use valid option IDs from the context provided. Do NOT use markdown code blocks for the tag. '
        'If they ask for an "Android App" or "App", set category to "android" and tech to "flutter", "kotlin", or "android-dev". '
        'If they ask for a website/web app, set category to "engineering" and tech to "nextjs", "react" etc.\n\n'
        'Here is the current state of the app and the options they have available:\n${widget.contextData}\n\n'
        'Acknowledge this context by saying hello to the user.';

    _initModelAndChat('gemini-2.5-flash');

    // Add initial greeting to UI
    _messages.add(ChatMessage(
      text: "Hi! I'm the ShubDeep Labs AI Assistant. Need help picking a Tech Stack or Add-Ons for your project? Ask me anything!", 
      isUser: false
    ));
  }

  void _initModelAndChat(String modelName, {List<Content>? history}) {
    _activeModelName = modelName;
    _model = GenerativeModel(
      model: modelName,
      apiKey: widget.apiKey,
      systemInstruction: Content.system(_initialPrompt),
    );

    _chat = _model.startChat(history: history ?? [
      Content.model([TextPart("Hi! I'm the ShubDeep Labs AI Assistant. Need help picking a Tech Stack or Add-Ons for your project? Ask me anything!")]),
    ]);
  }

  Future<GenerateContentResponse> _sendWithRetryAndFallback(String messageText) async {
    final modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];
    const int maxRetriesPerModel = 3;
    const int baseDelayMs = 1000;

    // Snapshot history before attempting
    final previousHistory = _chat.history.toList();

    for (int modelIndex = 0; modelIndex < modelsToTry.length; modelIndex++) {
      String currentModelName = modelsToTry[modelIndex];

      // Re-initialize if we are switching models (fallback)
      if (_activeModelName != 'models/$currentModelName' && _activeModelName != currentModelName) {
        debugPrint('[Gemini API] Falling back to model: $currentModelName');
        _initModelAndChat(currentModelName, history: previousHistory);
      }

      for (int attempt = 0; attempt < maxRetriesPerModel; attempt++) {
        try {
          debugPrint('[Gemini API] Requesting $currentModelName (Attempt ${attempt + 1}/$maxRetriesPerModel)...');
          
          final response = await _chat.sendMessage(Content.text(messageText))
                                      .timeout(const Duration(seconds: 15));
          
          debugPrint('[Gemini API] Successfully received response from $currentModelName.');
          return response;

        } catch (e) {
          String errorStr = e.toString().toLowerCase();
          debugPrint('[Gemini API] Error on $currentModelName: $errorStr');

          bool isTransient = errorStr.contains('503') || 
                             errorStr.contains('unavailable') || 
                             errorStr.contains('429') || 
                             errorStr.contains('quota') || 
                             errorStr.contains('500') || 
                             errorStr.contains('internal') ||
                             e is TimeoutException;

          // If the error caused the chat history to be unbalanced, reset it back to our snapshot
          if (_chat.history.length > previousHistory.length) {
            _initModelAndChat(currentModelName, history: previousHistory);
          }

          if (isTransient) {
            if (attempt < maxRetriesPerModel - 1) {
              int delay = baseDelayMs * (1 << attempt); // 1s, 2s, 4s
              debugPrint('[Gemini API] Transient error. Retrying in ${delay / 1000}s...');
              
              if (mounted) {
                setState(() {
                  _loadingText = "AI is busy right now. Retrying in ${delay / 1000}s...";
                });
              }
              
              await Future.delayed(Duration(milliseconds: delay));
              
              if (mounted) {
                setState(() {
                  _loadingText = "AI is thinking...";
                });
              }
            } else {
              debugPrint('[Gemini API] Max retries exhausted for $currentModelName.');
              // Exhausted retries for this model, break inner loop to try next model
              if (modelIndex == modelsToTry.length - 1) {
                 throw Exception('Service is currently experiencing extremely high demand. Please wait a moment and try again.');
              }
              break; 
            }
          } else {
            // Unrecoverable error (e.g. invalid API key, safety blocks)
            throw Exception('I encountered an error. Please wait a moment and try again.');
          }
        }
      }
    }
    
    throw Exception('All fallback models exhausted. Please try again later.');
  }

  Future<void> _sendMessage() async {
    if (_controller.text.trim().isEmpty || _isLoading) return;

    final userMessage = _controller.text.trim();
    setState(() {
      _messages.add(ChatMessage(text: userMessage, isUser: true));
      _controller.clear();
      _isLoading = true;
      _loadingText = "AI is thinking...";
    });
    _scrollToBottom();

    try {
      final response = await _sendWithRetryAndFallback(userMessage);
      
      if (mounted) {
        setState(() {
          String replyText = response.text ?? 'Sorry, I had trouble processing that.';
          
          // Parse CUSTOMIZER tag
          final RegExp customizerRegex = RegExp(r'\[CUSTOMIZER:\s*(\{.*?\})\s*\]', dotAll: true);
          final match = customizerRegex.firstMatch(replyText);
          
          if (match != null) {
            String jsonStr = match.group(1)!;
            // Clean common JSON issues from LLM
            jsonStr = jsonStr.replaceAll("'", '"');
            jsonStr = jsonStr.replaceAll(RegExp(r',\s*\}'), '}');
            jsonStr = jsonStr.replaceAll(RegExp(r',\s*\]'), ']');
            
            try {
              Map<String, dynamic> parsedData = jsonDecode(jsonStr);
              widget.onSelectionsUpdated?.call(parsedData);
            } catch (e) {
              debugPrint('Failed to parse CUSTOMIZER JSON: $e');
            }
            // Remove the tag from the displayed text
            replyText = replyText.replaceAll(customizerRegex, '').trim();
          }

          _messages.add(ChatMessage(
            text: replyText, 
            isUser: false
          ));
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          // e.toString() already contains the user-friendly message from the throw
          final errorMsg = e.toString().replaceFirst('Exception: ', '');
          _messages.add(ChatMessage(
            text: errorMsg, 
            isUser: false
          ));
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        _scrollToBottom();
      }
    }
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return GlassBackground(
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          title: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('🤖', style: TextStyle(fontSize: 24)),
              SizedBox(width: 8),
              Text(
                'AI Assistant',
                style: TextStyle(fontWeight: FontWeight.w900, fontSize: 20, color: Color(0xFF2C2C2C)),
              ),
            ],
          ),
          backgroundColor: Colors.transparent,
          elevation: 0,
          centerTitle: true,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios_new, color: Color(0xFF2C2C2C)),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: Stack(
        children: [
          // Background Logo Watermark
          Center(
            child: Opacity(
              opacity: 0.70, // Increased opacity to 70%
              child: Image.asset(
                'assets/logo_transparent.png',
                width: MediaQuery.of(context).size.width * 0.8,
                fit: BoxFit.contain,
              ),
            ),
          ),
          Column(
        children: [
          // Chat Messages
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                return _buildMessageBubble(msg);
              },
            ),
          ),
          
          // Loading Indicator
          if (_isLoading)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0),
              child: Text(_loadingText, style: const TextStyle(color: Colors.grey, fontStyle: FontStyle.italic)),
            ),

          // Input Area
          GlassContainer(
            padding: const EdgeInsets.all(16),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: _isLoading ? Colors.white.withOpacity(0.4) : Colors.white.withOpacity(0.6),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white.withOpacity(0.8), width: 1.5),
                    ),
                    child: TextField(
                      controller: _controller,
                      enabled: !_isLoading, 
                      style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF2C2C2C)),
                      decoration: InputDecoration(
                        hintText: _isLoading ? 'Please wait...' : 'Ask about tech stacks...',
                        hintStyle: TextStyle(color: const Color(0xFF2C2C2C).withOpacity(0.5)),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                GestureDetector(
                  onTap: _isLoading ? null : _sendMessage,
                  child: GlassCard(
                    isSelected: false,
                    baseColor: _isLoading ? const Color(0xFF757575) : const Color(0xFF66BB6A),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Icon(Icons.send, color: _isLoading ? Colors.black54 : const Color(0xFF2C2C2C)),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      ],
      ),
    ));
  }

  Widget _buildMessageBubble(ChatMessage msg) {
    return Align(
      alignment: msg.isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: GlassContainer(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        borderRadius: BorderRadius.circular(16).copyWith(
          bottomRight: msg.isUser ? const Radius.circular(0) : const Radius.circular(16),
          bottomLeft: msg.isUser ? const Radius.circular(16) : const Radius.circular(0),
        ),
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
          child: Text(
            msg.text,
            style: const TextStyle(fontSize: 15, color: Color(0xFF2C2C2C), height: 1.4, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    ).animate().scale(
      duration: 300.ms,
      curve: Curves.easeOutBack,
      alignment: msg.isUser ? Alignment.bottomRight : Alignment.bottomLeft,
    ).fadeIn(duration: 300.ms)
     .fade(duration: 400.ms, curve: Curves.easeOutQuad)
     .slideX(begin: msg.isUser ? 0.2 : -0.2, end: 0, duration: 400.ms, curve: Curves.easeOutQuad);
  }
}
