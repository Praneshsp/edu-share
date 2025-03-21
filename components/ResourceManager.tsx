'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DropResult } from '@hello-pangea/dnd';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Link, File, Video, Image as ImageIcon, Grip, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { getResources } from '@/actions/resources';
import Image from 'next/image';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Base Resource type from database
export interface Resource {
  id: string;
  group_id: string;
  resource_link: string;
  created_at: string;
}

// Extended Resource type for UI
interface ResourceWithUI extends Resource {
  title?: string;
  type?: 'link' | 'file' | 'video' | 'image';
  order?: number;
}

type ResourceType = 'link' | 'file' | 'video' | 'image';

interface ResourceManagerProps {
  groupId: string;
}

const resourceTypeIcons = {
  link: <Link className="w-4 h-4" />,
  file: <File className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  image: <ImageIcon className="w-4 h-4" />,
};

export default function ResourceManager({ groupId }: ResourceManagerProps) {
  const [resources, setResources] = useState<ResourceWithUI[]>([]);
  const [newResourceLink, setNewResourceLink] = useState('');
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceType, setNewResourceType] = useState<ResourceType>('link');
  const [loading, setLoading] = useState(true);
  const [isAddingResource, setIsAddingResource] = useState(false);

  const fetchResources = useCallback(async () => {
    try {
      const data = await getResources(groupId);
      // Transform the data to include UI-specific fields
      const transformedData = data.map((resource, index) => ({
        ...resource,
        title: resource.resource_link.split('/').pop() || 'Untitled Resource',
        type: 'link' as ResourceType,
        order: index
      }));
      setResources(transformedData);
    } catch (err) {
      console.error('Error fetching resources:', err);
      toast.error('Error fetching resources');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleAddResource = async () => {
    if (!newResourceLink.trim() || !newResourceTitle.trim()) {
      toast.error('Please enter both title and link');
      return;
    }

    try {
      const maxOrder = Math.max(...resources.map(r => r.order || 0), -1);
      const { data, error: insertError } = await supabase
        .from('group_resources')
        .insert([
          {
            group_id: groupId,
            resource_link: newResourceLink,
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Add UI-specific fields to the new resource
      const newResourceWithUI: ResourceWithUI = {
        ...data,
        title: newResourceTitle,
        type: newResourceType,
        order: maxOrder + 1,
      };

      setResources([...resources, newResourceWithUI]);
      setNewResourceLink('');
      setNewResourceTitle('');
      setIsAddingResource(false);
      toast.success('Resource added successfully');
    } catch (err) {
      console.error('Error adding resource:', err);
      toast.error('Error adding resource');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(resources);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order of all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setResources(updatedItems);

    // Update the order in the database
    try {
      const updates = updatedItems.map((item) => ({
        id: item.id,
        resource_link: item.resource_link,
      }));

      const { error: updateError } = await supabase
        .from('group_resources')
        .upsert(updates);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error updating resource order:', err);
      toast.error('Error updating resource order');
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('group_resources')
        .delete()
        .eq('id', resourceId);

      if (deleteError) throw deleteError;

      setResources(resources.filter(resource => resource.id !== resourceId));
      toast.success('Resource deleted successfully');
    } catch (err) {
      console.error('Error deleting resource:', err);
      toast.error('Error deleting resource');
    }
  };

  const getResourcePreview = (resource: ResourceWithUI) => {
    if (resource.type === 'image') {
      return (
        <div className="mt-2">
          <Image
            src={resource.resource_link}
            alt={resource.title || 'Resource image'}
            width={500}
            height={300}
            className="w-full h-32 object-cover rounded-md"
          />
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Learning Resources</h2>
          <p className="text-slate-500 mt-1">Access and organize your learning materials</p>
        </div>
        <button 
          onClick={() => setIsAddingResource(!isAddingResource)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {isAddingResource ? 'Cancel' : 'Add Resource'}
        </button>
      </div>

      {isAddingResource && (
        <Card className="mb-6 border-2 border-indigo-100">
          <CardHeader className="p-4 bg-indigo-50 rounded-t-lg">
            <h3 className="text-lg font-semibold text-indigo-900">Add New Resource</h3>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Title</label>
                <Input
                  type="text"
                  value={newResourceTitle}
                  onChange={(e) => setNewResourceTitle(e.target.value)}
                  placeholder="Enter resource title..."
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Link</label>
                <Input
                  type="text"
                  value={newResourceLink}
                  onChange={(e) => setNewResourceLink(e.target.value)}
                  placeholder="Enter resource link..."
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-4 items-end">
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium text-slate-700">Type</label>
                <Select
                  value={newResourceType}
                  onValueChange={(value: ResourceType) => setNewResourceType(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="file">File</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleAddResource} 
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Resource
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {resources.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
          <div className="text-slate-400 mb-2">
            <Link className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-1">No Resources Yet</h3>
          <p className="text-slate-500">Add your first learning resource to get started</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="resources">
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {resources.map((resource, index) => (
                  <Draggable
                    key={resource.id}
                    draggableId={resource.id}
                    index={index}
                  >
                    {(provided: DraggableProvided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-white hover:shadow-md transition-all duration-200 border border-slate-100"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div
                              {...provided.dragHandleProps}
                              className="mt-1 cursor-grab active:cursor-grabbing p-2 hover:bg-slate-50 rounded"
                            >
                              <Grip className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="p-1 bg-slate-100 rounded">
                                  {resourceTypeIcons[resource.type || 'link']}
                                </div>
                                <h4 className="font-medium truncate text-slate-800">
                                  {resource.title || 'Untitled Resource'}
                                </h4>
                              </div>
                              <a
                                href={resource.resource_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline truncate flex items-center gap-1"
                              >
                                {resource.resource_link}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              {getResourcePreview(resource)}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteResource(resource.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
} 