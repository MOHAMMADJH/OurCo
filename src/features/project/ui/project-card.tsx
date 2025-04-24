import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, Users } from 'lucide-react';
import { Project, ProjectStatus } from '@/entities/project/model/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/atoms/card';
import { Badge } from '@/shared/ui/atoms/badge';
import { Button } from '@/shared/ui/atoms/button';
import { Progress } from '@/shared/ui/atoms/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/atoms/avatar';
import { ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';

/**
 * ProjectCard props interface
 */
interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

/**
 * ProjectCard component
 * Displays a project in a card format
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  variant = 'default',
  className,
}) => {
  const {
    id,
    title,
    description,
    status,
    progress,
    startDate,
    endDate,
    client,
    team,
    image,
  } = project;

  const isDetailed = variant === 'detailed';
  const isCompact = variant === 'compact';
  
  // Format dates
  const formattedStartDate = startDate ? format(new Date(startDate), 'MMM d, yyyy') : 'Not set';
  const formattedEndDate = endDate ? format(new Date(endDate), 'MMM d, yyyy') : 'Not set';
  
  // Generate project URL
  const projectUrl = `${ROUTES.DASHBOARD_PROJECTS}/${id}`;
  
  // Get status badge color
  const getStatusColor = () => {
    switch (status) {
      case ProjectStatus.PLANNING:
        return 'bg-blue-100 text-blue-800';
      case ProjectStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case ProjectStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case ProjectStatus.ON_HOLD:
        return 'bg-orange-100 text-orange-800';
      case ProjectStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-md h-full flex flex-col",
        className
      )}
    >
      {/* Project Image */}
      {image && !isCompact && (
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Card Header */}
      <CardHeader className={cn(isCompact && "p-4")}>
        <div className="flex items-start justify-between">
          <div>
            <Link to={projectUrl} className="group">
              <h3 className={cn(
                "font-bold transition-colors group-hover:text-primary",
                isDetailed ? "text-2xl" : "text-xl",
                isCompact && "text-lg"
              )}>
                {title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              {client.name}
            </p>
          </div>
          
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            getStatusColor()
          )}>
            {status.replace('_', ' ')}
          </span>
        </div>
      </CardHeader>
      
      {/* Card Content */}
      <CardContent className={cn(
        "flex-1",
        isCompact && "p-4 pt-0"
      )}>
        {!isCompact && (
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {description}
          </p>
        )}
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Project details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1">Start Date</span>
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span className="text-sm">{formattedStartDate}</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground mb-1">End Date</span>
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span className="text-sm">{formattedEndDate}</span>
            </div>
          </div>
        </div>
        
        {/* Team members (only in detailed view) */}
        {isDetailed && team && team.length > 0 && (
          <div className="mt-4">
            <span className="text-xs text-muted-foreground mb-2 block">Team Members</span>
            <div className="flex -space-x-2">
              {team.slice(0, 5).map((member) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {team.length > 5 && (
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                  +{team.length - 5}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Card Footer */}
      <CardFooter className={cn(
        "mt-auto border-t pt-4",
        isCompact && "p-4 pt-2"
      )}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Users className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-sm text-muted-foreground">
              {team?.length || 0} members
            </span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            asChild
          >
            <Link to={projectUrl}>
              View Details
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
