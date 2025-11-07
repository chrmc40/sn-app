package com.snapp.test;

import android.graphics.Rect;
import android.view.View;
import android.view.WindowInsets;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;

@CapacitorPlugin(name = "SystemBars")
public class SystemBarsPlugin extends Plugin {

    @PluginMethod
    public void getHeights(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            View decorView = getActivity().getWindow().getDecorView();

            JSObject result = new JSObject();

            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.R) {
                WindowInsets insets = decorView.getRootWindowInsets();
                if (insets != null) {
                    android.graphics.Insets systemBars = insets.getInsets(WindowInsets.Type.systemBars());
                    android.graphics.Insets navBars = insets.getInsets(WindowInsets.Type.navigationBars());

                    result.put("statusBar", systemBars.top);
                    // Only report nav bar height if it's actually visible (non-zero)
                    result.put("navigationBar", navBars.bottom);
                } else {
                    result.put("statusBar", 0);
                    result.put("navigationBar", 0);
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
            }

            call.resolve(result);
        });
    }
}
