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
 * Get badge color based on project status
 */
function getStatusColor(status: ProjectStatus) {
  switch (status) {
    case ProjectStatus.PLANNING:
      return 'bg-blue-200 text-blue-800';
    case ProjectStatus.IN_PROGRESS:
      return 'bg-orange-200 text-orange-800';
    case ProjectStatus.COMPLETED:
      return 'bg-green-200 text-green-800';
    case ProjectStatus.ON_HOLD:
      return 'bg-yellow-200 text-yellow-800';
    case ProjectStatus.CANCELLED:
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
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

  // Status display
  const statusText = status.toString().replace('_', ' ');
  const statusColor = getStatusColor(status);
  
  return (
    <Card className={cn('overflow-hidden hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">
              <Link to={`${ROUTES.DASHBOARD_PROJECTS}/${id}`} className="hover:text-blue-500 transition-colors">
                {title}
              </Link>
            </h3>
            <Badge className={statusColor}>{statusText}</Badge>
          </div>
          {progress !== undefined && !isCompact && (
            <div className="text-sm font-medium">{progress}%</div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-0">
        {!isCompact && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
            {description}
          </p>
        )}
        
        {progress !== undefined && !isCompact && (
          <div className="space-y-1 mb-4">
            <Progress value={progress} />
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          {(startDate || endDate) && (
            <div className="flex space-x-4 rtl:space-x-reverse text-sm">
              {startDate && (
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                  <span>Start: {formattedStartDate}</span>
                </div>
              )}
              {endDate && (
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1 text-gray-500" />
                  <span>Due: {formattedEndDate}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {isDetailed && team && team.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-sm">Team ({team.length})</span>
            </div>
            <div className="flex -space-x-2 rtl:space-x-reverse mt-1">
              {team.slice(0, 5).map((member) => (
                <Avatar key={member.id} className="border-2 border-white">
                  {member.avatar ? (
                    <AvatarImage src={member.avatar} alt={member.name} />
                  ) : (
                    <AvatarFallback>
                      {member.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              ))}
              {team.length > 5 && (
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-xs font-medium">
                  +{team.length - 5}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-4">
        <div className="flex justify-between w-full">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              {client?.logo ? (
                <AvatarImage src={client.logo} alt={client?.name || ''} />
              ) : (
                <AvatarFallback>{(client?.name?.substring(0, 2) || 'CL').toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <span className="text-xs">{client?.name}</span>
          </div>
          
          <Link to={`${ROUTES.DASHBOARD_PROJECTS}/${id}`}>
            <Button variant="outline" className="h-7 px-2 text-xs">
              View
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
