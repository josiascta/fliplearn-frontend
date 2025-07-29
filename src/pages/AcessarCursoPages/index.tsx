import React, { useState } from "react";
import { Breadcrumb } from "./Breadcrumb";
import { CourseHeader } from "./CourseHeader";
import { TabNavigation } from "./TabNavigation";
import { OverviewTab } from "./OverviewTab";
import { StudentsTab } from "./StudentsTab";
import { MaterialsTab } from "./MaterialsTab";
import { ActivitiesTab } from "./ActivitiesTab";
import { VideosTab } from "./VideosTab";
import { NoticesTab } from "./NoticesTab";

type ActiveTab =
  | "overview"
  | "students"
  | "materials"
  | "activities"
  | "videos"
  | "notices";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "students":
        return <StudentsTab />;
      case "materials":
        return <MaterialsTab />;
      case "activities":
        return <ActivitiesTab />;
      case "videos":
        return <VideosTab />;
      case "notices":
        return <NoticesTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-50"
      style={{ minHeight: "1024px" }}
    >
      <main className="flex-1 pt-20">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <Breadcrumb />
            <CourseHeader />
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
