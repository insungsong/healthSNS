#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <ReactNativeNavigation/ReactNativeNavigation.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  [ReactNativeNavigation bootstrap:jsCodeLocation launchOptions:launchOptions];
  
  
//  NSURL *jsCodeLocation;
//#ifdef DEBUG
//  //  jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
//  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
//#else
//  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//#endif
  
  
  // **********************************************
  // *** DON'T MISS: THIS IS HOW WE BOOTSTRAP *****
  // **********************************************
//  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
//  self.window.backgroundColor = [UIColor whiteColor];
//  [[RCCManager sharedInstance] initBridgeWithBundleURL:jsCodeLocation launchOptions:launchOptions];
  
  /*
   // original RN bootstrap - remove this part
   RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
   moduleName:@"example"
   initialProperties:nil
   launchOptions:launchOptions];
   self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
   UIViewController *rootViewController = [UIViewController new];
   rootViewController.view = rootView;
   self.window.rootViewController = rootViewController;
   [self.window makeKeyAndVisible];
   */
  
  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
//                                       sourceApplication:(NSString *)sourceApplication
//                                               annotation:(id)annotation {
//     if ([KOSession isKakaoAccountLoginCallback:url]) {
//         return [KOSession handleOpenURL:url];
//     }

//     return false;
// }

// - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
//                                                 options:(NSDictionary<NSString *,id> *)options {
//     if ([KOSession isKakaoAccountLoginCallback:url]) {
//         return [KOSession handleOpenURL:url];
//     }

//     return false;
// }

// - (void)applicationDidBecomeActive:(UIApplication *)application
// {
//     [KOSession handleDidBecomeActive];
// }

@end
