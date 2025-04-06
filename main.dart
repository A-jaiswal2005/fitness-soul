import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'dart:async';
import 'dart:io';

void main() {
  // Required for initializing inappwebview
  WidgetsFlutterBinding.ensureInitialized();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false, // Hide debug banner
      home: const FitnessSoulWebView(),
    );
  }
}

class FitnessSoulWebView extends StatefulWidget {
  const FitnessSoulWebView({super.key});

  @override
  State<FitnessSoulWebView> createState() => _FitnessSoulWebViewState();
}

class _FitnessSoulWebViewState extends State<FitnessSoulWebView> {
  final String websiteUrl = 'https://fitness-soul-9277b.web.app/';
  InAppWebViewController? webViewController;
  double progress = 0;
  bool isLoading = true;
  bool isOnline = true;
  late PullToRefreshController pullToRefreshController;
  Timer? connectivityTimer;

  @override
  void initState() {
    super.initState();
    
    // Initialize pull-to-refresh controller
    initPullToRefreshController();
    
    // Initial check for connectivity
    checkConnectivity();
    
    // Set up a periodic connectivity check
    connectivityTimer = Timer.periodic(Duration(seconds: 5), (_) {
      checkConnectivity();
    });
  }

  void initPullToRefreshController() {
    pullToRefreshController = PullToRefreshController(
      settings: PullToRefreshSettings(
        color: Colors.blue,
      ),
      onRefresh: () async {
        if (isOnline) {
          await webViewController?.reload();
        } else {
          await checkConnectivity();
          if (isOnline) {
            await webViewController?.reload();
          }
        }
        pullToRefreshController.endRefreshing();
      },
    );
  }

  @override
  void dispose() {
    connectivityTimer?.cancel();
    super.dispose();
  }

  Future<void> checkConnectivity() async {
    try {
      // Use a simple lookup to check connectivity
      final result = await InternetAddress.lookup('google.com');
      setState(() {
        isOnline = result.isNotEmpty && result[0].rawAddress.isNotEmpty;
      });
    } on SocketException catch (_) {
      setState(() {
        isOnline = false;
      });
    } catch (e) {
      setState(() {
        isOnline = false;
      });
    }
  }

  Future<void> _refresh() async {
    await checkConnectivity();
    
    if (isOnline && webViewController != null) {
      await webViewController?.reload();
    }
  }

  Widget _buildOfflineUI() {
    return Container(
      color: Colors.white,
      width: double.infinity,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.signal_wifi_off,
            size: 80,
            color: Colors.grey,
          ),
          const SizedBox(height: 20),
          Text(
            "You are offline",
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            "Please check your internet connection",
            style: TextStyle(
              fontSize: 16,
              color: Colors.black54,
            ),
          ),
          const SizedBox(height: 30),
          ElevatedButton.icon(
            onPressed: () async {
              await checkConnectivity();
              if (isOnline && webViewController != null) {
                await webViewController?.reload();
              }
            },
            icon: Icon(Icons.refresh),
            label: Text("Try Again"),
            style: ElevatedButton.styleFrom(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Black line/space at the top
            Container(
              width: double.infinity,
              height: 10,
              color: Colors.black,
            ),
            // Show progress indicator only when loading and online
            if (progress < 1.0 && isOnline && isLoading)
              LinearProgressIndicator(value: progress),
            Expanded(
              child: RefreshIndicator(
                onRefresh: _refresh,
                child: isOnline
                    ? InAppWebView(
                        initialUrlRequest: URLRequest(
                          url: WebUri(websiteUrl),
                        ),
                        pullToRefreshController: pullToRefreshController,
                        onWebViewCreated: (controller) {
                          webViewController = controller;
                        },
                        onLoadStart: (controller, url) {
                          setState(() {
                            isLoading = true;
                          });
                        },
                        onLoadStop: (controller, url) {
                          setState(() {
                            isLoading = false;
                          });
                          pullToRefreshController.endRefreshing();
                        },
                        onProgressChanged: (controller, progress) {
                          setState(() {
                            this.progress = progress / 100;
                          });
                        },
                        onReceivedError: (controller, request, error) {
                          pullToRefreshController.endRefreshing();
                          
                          // Check if the error is network-related
                          checkConnectivity();
                        },
                      )
                    : ListView(
                        physics: const AlwaysScrollableScrollPhysics(),
                        children: [
                          SizedBox(
                            height: MediaQuery.of(context).size.height - 20,
                            child: _buildOfflineUI(),
                          ),
                        ],
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}