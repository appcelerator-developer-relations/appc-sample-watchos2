//
//  InterfaceController.h
//  WatchOS2 WatchApp Extension
//
//  Created by not specified on 8/26/2015.
//  not specified. All rights reserved.
//

#import <WatchKit/WatchKit.h>
#import <Foundation/Foundation.h>

// Import the WatchConnectivity Framework
#import <WatchConnectivity/WatchConnectivity.h>

// Add the <WCSessionDelegate>
@interface InterfaceController : WKInterfaceController <WCSessionDelegate> {
    WCSession *watchSession;
    
    // Variables to persist our state
    NSString *lastLog;
    NSData *lastImage;
}

// UI outlets we use
@property (strong, nonatomic) IBOutlet WKInterfaceLabel *logText;
@property (strong, nonatomic) IBOutlet WKInterfaceImage *logImage;

// Public methods the UI uses
-(IBAction)sendMessage:(id)sender;
-(IBAction)transferFile:(id)sender;
-(IBAction)transferUserInfo:(id)sender;
-(IBAction)updateApplicationContext:(id)sender;

@end
