import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardContent, Box, Typography } from '@mui/material'

function DashboardCard({ 
  title, 
  subtitle, 
  actions, 
  children, 
  height = 'auto',
  ...props 
}) {
  return (
    <Card 
      sx={{ 
        height,
        border: '1px solid #e0e0e0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        ...props.sx 
      }}
      {...props}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Header */}
        {(title || actions) && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            mb: subtitle ? 1 : 2 
          }}>
            <Box sx={{ flex: 1 }}>
              {title && (
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600, 
                    fontSize: '14px',
                    color: '#333',
                    lineHeight: 1.2
                  }}
                >
                  {title}
                </Typography>
              )}
            </Box>
            {actions && (
              <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                {actions}
              </Box>
            )}
          </Box>
        )}

        {/* Subtitle */}
        {subtitle && (
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              color: 'text.secondary',
              fontSize: '11px',
              mb: 2,
              lineHeight: 1.3
            }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Content */}
        <Box sx={{ 
          position: 'relative',
          minHeight: height === 'auto' ? 'auto' : `calc(${height} - 80px)` 
        }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  )
}

DashboardCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default DashboardCard