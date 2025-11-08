package com.snapp.test;

import android.content.res.Configuration;
import android.graphics.Rect;
import android.view.Surface;
import android.view.View;
import android.view.WindowInsets;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;

@CapacitorPlugin(name = "SystemBars")
public class SystemBarsPlugin extends Plugin {

    @Override
    protected void handleOnConfigurationChanged(Configuration newConfig) {
        super.handleOnConfigurationChanged(newConfig);
        // Notify JS side that configuration changed
        notifyListeners("configurationChanged", null);
    }

    @PluginMethod
    public void getHeights(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            View decorView = getActivity().getWindow().getDecorView();

            JSObject result = new JSObject();

            // Get rotation/orientation
            int rotation = getActivity().getWindowManager().getDefaultDisplay().getRotation();
            int orientation = 0;
            switch (rotation) {
                case Surface.ROTATION_0:
                    orientation = 0;
                    break;
                case Surface.ROTATION_90:
                    orientation = 90;
                    break;
                case Surface.ROTATION_180:
                    orientation = 180;
                    break;
                case Surface.ROTATION_270:
                    orientation = 270;
                    break;
            }
            result.put("orientation", orientation);

            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
                WindowInsets insets = decorView.getRootWindowInsets();
                if (insets != null) {
                    android.graphics.Insets systemBars = insets.getInsets(WindowInsets.Type.systemBars());
                    android.graphics.Insets navBars = insets.getInsets(WindowInsets.Type.navigationBars());

                    // Return all insets
                    result.put("statusBar", systemBars.top);
                    result.put("navigationBar", navBars.bottom);
                    result.put("navBarLeft", navBars.left);
                    result.put("navBarRight", navBars.right);

                    // Determine which side nav bar is on
                    String navBarSide = "bottom";
                    if (navBars.left > 0) {
                        navBarSide = "left";
                    } else if (navBars.right > 0) {
                        navBarSide = "right";
                    } else if (navBars.bottom > 0) {
                        navBarSide = "bottom";
                    }
                    result.put("navBarSide", navBarSide);
                } else {
                    result.put("statusBar", 0);
                    result.put("navigationBar", 0);
                    result.put("navBarLeft", 0);
                    result.put("navBarRight", 0);
                    result.put("navBarSide", "bottom");
                }
            } else {
                // Fallback for older Android versions
                Rect rect = new Rect();
                decorView.getWindowVisibleDisplayFrame(rect);
                int statusBarHeight = rect.top;

                int resourceId = getContext().getResources().getIdentifier("status_bar_height", "dimen", "android");
                if (resourceId > 0) {
                    statusBarHeight = getContext().getResources().getDimensionPixelSize(resourceId);
                }

                // For older versions, calculate actual visible nav bar
                int navigationBarHeight = 0;
                int screenHeight = decorView.getHeight();
                int contentHeight = rect.bottom;
                navigationBarHeight = screenHeight - contentHeight;

                result.put("statusBar", statusBarHeight);
                result.put("navigationBar", navigationBarHeight);
                result.put("navBarLeft", 0);
                result.put("navBarRight", 0);
                result.put("navBarSide", "bottom");
            }

            call.resolve(result);
        });
    }
}
