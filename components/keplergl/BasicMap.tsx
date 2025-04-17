"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

// 基础地图组件
const BasicMap = () => {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="w-full h-screen p-4">
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>地球可视化</CardTitle>
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <CardDescription>
            基于 Google Maps 的地球可视化工具
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center">
          {showMap ? (
            <div className="w-full h-full flex items-center justify-center">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d24433280.837759!2d113.90887271472103!3d34.6732969402357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2scn!4v1604303501636!5m2!1sen!2scn" 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          ) : (
            <div className="flex flex-col gap-4 items-center justify-center p-6 max-w-lg mx-auto text-center">
              <Globe className="h-12 w-12 text-primary mb-2" />
              <h3 className="text-xl font-semibold">地球地图可视化</h3>
              <p className="text-muted-foreground">
                这是一个基于 Google Maps 的地球可视化工具，可以查看全球地理信息。
              </p>
              <Button onClick={() => setShowMap(true)} className="mt-4">
                显示地图
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicMap; 