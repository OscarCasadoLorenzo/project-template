"use client";

import { useGlobalToast } from "@/hooks";
import { Button } from "@project-template/ui";

/**
 * Simple Toast Test Component
 *
 * Quick test component to verify toast with action button works
 */
export default function ToastTestPage() {
  const toast = useGlobalToast();

  const testBasicAction = () => {
    toast.warning("Test Action Button", "Click the action button to test", 0, {
      label: "Click Me",
      onClick: () => {
        alert("Action button clicked!");
        toast.success("Action worked!");
      },
    });
  };

  const testSaveAction = () => {
    toast.warning(
      "Unsaved changes",
      "You have unsaved changes that will be lost",
      0,
      {
        label: "Save Now",
        onClick: () => {
          toast.success("Changes saved!");
        },
      },
    );
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Toast Action Button Test</h1>

      <div className="space-y-4">
        <Button onClick={testBasicAction} variant="outline">
          Test Action Button (with Alert)
        </Button>

        <Button onClick={testSaveAction} variant="outline">
          Test Save Action
        </Button>
      </div>

      <div className="bg-muted p-4 rounded mt-8">
        <p className="text-sm">
          <strong>Expected behavior:</strong>
          <br />
          - Toast should appear in top-right
          <br />
          - Toast should have a "Save Now" or "Click Me" button
          <br />
          - Clicking the button should trigger the action
          <br />- Duration is set to 0 (indefinite) so toast stays until
          dismissed
        </p>
      </div>
    </div>
  );
}
