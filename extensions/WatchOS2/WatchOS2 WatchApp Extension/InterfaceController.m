//
//  InterfaceController.m
//  WatchOS2 WatchApp Extension
//
//  Created by not specified on 8/26/2015.
//  not specified. All rights reserved.
//

#import "InterfaceController.h"


@interface InterfaceController()

@end


@implementation InterfaceController

- (void)awakeWithContext:(id)context {
    [super awakeWithContext:context];

    // Configure interface objects here.
}

- (void)willActivate {
    
    // This method is called when watch view controller is about to be visible to user
    [super willActivate];
    
    // Create a WatchConnectivity session if we haven't yet
    if ([WCSession isSupported] && watchSession == nil) {
        watchSession = [WCSession defaultSession];
        watchSession.delegate = self;
        [watchSession activateSession];
    }
    
    // Nothing more to do
    if (watchSession == nil) {
        return;
    }
    
    // Restore our last received  (or data received while in background)
    [self showLog:lastLog withImage:lastImage andMode:@"restored"];
}

- (void)didDeactivate {
    
    // This method is called when watch view controller is no longer visible
    [super didDeactivate];
}

// Helper method to show a log text and optional image in the UI
- (void)showLog:(NSString *)text withImage:(NSData *)data andMode:(NSString *)mode {
    
    if (text != nil) {

        // Combine log text and 'mode'
        _logText.text = [NSString stringWithFormat:@"(%@) %@", mode, text];
    }

    // If it's nil it will remove the image
    [_logImage setImageData:data];
    
    // Save the text and image to restore in willActivate
    lastLog = text;
    lastImage = data;
    
    [self hideLog];
}

// Helper method to hide the text and image after 5 seconds
- (void)hideLog {
    dispatch_time_t delay = dispatch_time(DISPATCH_TIME_NOW, NSEC_PER_SEC * 5);
    dispatch_after(delay, dispatch_get_main_queue(), ^(void){
        _logText.text = NULL;
        [_logImage setImageData:NULL];
    });
}

// Methods called in the UI
#pragma mark watch methods

// Send an object to the iPhone
-(IBAction)sendMessage:(id)sender
{
    [watchSession sendMessage:[NSDictionary dictionaryWithObjectsAndKeys:@"bar",@"foo", nil] replyHandler:nil errorHandler:nil];
}

// Send a file to the iPhone (queued when not available)
-(IBAction)transferFile:(id)sender
{
    NSURL *fileURL = [[NSBundle mainBundle] URLForResource:@"logo" withExtension:@"png"];
    [watchSession transferFile:fileURL metadata:[NSDictionary dictionaryWithObjectsAndKeys:@"bar",@"foo",nil]];
}

// Send an object to the iPhone (queued when not available)
-(IBAction)transferUserInfo:(id)sender
{
    [watchSession transferUserInfo:[NSDictionary dictionaryWithObjectsAndKeys:@"bar",@"foo", nil]];
}

// Update application context (replacing previously queued when not available)
-(IBAction)updateApplicationContext:(id)sender
{
    [watchSession updateApplicationContext:[NSDictionary dictionaryWithObjectsAndKeys:@"bar",@"foo", nil] error:nil];
}

// Delegates (listeners) for events
#pragma mark watch delegates

// Called when received message from iPhone
- (void)session:(nonnull WCSession *)session didReceiveMessage:(nonnull NSDictionary<NSString *,id> *)message
{
    [self showLog:[NSString stringWithFormat:@"didReceiveMessage %@", message] withImage:nil andMode:@"live"];
}

// Called when received file from iPhone
- (void)session:(nonnull WCSession *)session didReceiveFile:(nonnull WCSessionFile *)file
{
    NSURL *url = [file fileURL];
    [self showLog:[NSString stringWithFormat:@"didReceiveFile %@", file.description] withImage:[NSData dataWithContentsOfURL:url] andMode:@"live"];
}

// Called when received userInfo from iPhone
- (void)session:(nonnull WCSession *)session didReceiveUserInfo:(nonnull NSDictionary<NSString *,id> *)userInfo
{
    [self showLog:[NSString stringWithFormat:@"didReceiveUserInfo %@", userInfo] withImage:nil andMode:@"live"];
}

// Called when received applicationContext from iPhone
- (void)session:(nonnull WCSession *)session didReceiveApplicationContext:(nonnull NSDictionary<NSString *,id> *)applicationContext
{
    [self showLog:[NSString stringWithFormat:@"didReceiveApplicationContext %@", applicationContext] withImage:nil andMode:@"live"];
}

// Called when file send from Watch has been received by iPhone
- (void)session:(nonnull WCSession *)session didFinishFileTransfer:(nonnull WCSessionFileTransfer *)fileTransfer error:(nullable NSError *)error
{
    [self showLog:[NSString stringWithFormat:@"didFinishFileTransfer %@", fileTransfer.description] withImage:nil andMode:@"live"];
}

// Called when userInfo send from Watch has been received by iPhone
- (void)session:(nonnull WCSession *)session didFinishUserInfoTransfer:(nonnull WCSessionUserInfoTransfer *)userInfoTransfer error:(nullable NSError *)error
{
    [self showLog:[NSString stringWithFormat:@"didFinishUserInfoTransfer %@", userInfoTransfer] withImage:nil andMode:@"live"];
}

@end
