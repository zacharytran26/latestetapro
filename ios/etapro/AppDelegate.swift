import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import FirebaseCore
import FirebaseMessaging
import UserNotifications

@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {

  override func application(_ application: UIApplication,
                            didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
    self.moduleName = "etapro"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]

    // Configure Firebase
    FirebaseApp.configure()

    if #available(iOS 10.0, *){
      UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]){
        granted, error in
        print("Permission Granted: \(granted)")
      }
    }
    // Set up push notification handling
    UNUserNotificationCenter.current().delegate = self
    application.registerForRemoteNotifications()
    Messaging.messaging().delegate = self

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // FCM token update
  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    print("FCM Token: \(fcmToken ?? "")")
  }

  // Notification received in foreground
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              willPresent notification: UNNotification,
                              withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([.alert, .badge, .sound])
  }

  // Notification tap handler
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              didReceive response: UNNotificationResponse,
                              withCompletionHandler completionHandler: @escaping () -> Void) {
    completionHandler()
  }


  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return self.bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
      return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
      return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
