"""
Export utilities for sprint plans (PDF, CSV)
"""
from typing import List, Dict, Any
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import pandas as pd
import io
import logging

logger = logging.getLogger(__name__)

def export_sprint_plan_to_pdf(sprint_plan: Dict[str, Any]) -> bytes:
    """
    Export sprint plan to PDF format
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    story = []
    styles = getSampleStyleSheet()
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=30,
    )
    story.append(Paragraph("Sprint Plan", title_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Summary
    summary_data = [
        ['Epics', str(sprint_plan.get('epics', 0))],
        ['Stories', str(sprint_plan.get('stories', 0))],
        ['Tasks', str(sprint_plan.get('tasks', 0))],
        ['Total Effort (Story Points)', str(sprint_plan.get('total_effort', 0))],
        ['Predicted Velocity', str(sprint_plan.get('predicted_velocity', 0))],
        ['Estimated Sprints', str(sprint_plan.get('estimated_sprints', 0))],
    ]
    
    summary_table = Table(summary_data, colWidths=[3*inch, 2*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Timeline
    timeline = sprint_plan.get('timeline', {})
    if timeline:
        story.append(Paragraph("Timeline Estimate", styles['Heading2']))
        timeline_data = [
            ['Estimated Sprints', str(timeline.get('estimated_sprints', 'N/A'))],
            ['Sprint Duration (weeks)', str(timeline.get('sprint_duration_weeks', 'N/A'))],
            ['Estimated Start', str(timeline.get('estimated_start_date', 'N/A'))],
            ['Estimated End', str(timeline.get('estimated_end_date', 'N/A'))],
            ['Confidence Level', str(timeline.get('confidence_level', 'N/A'))],
        ]
        
        timeline_table = Table(timeline_data, colWidths=[3*inch, 2*inch])
        timeline_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ]))
        story.append(timeline_table)
        story.append(Spacer(1, 0.3*inch))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()

def export_sprint_plan_to_csv(sprint_plan: Dict[str, Any], epics: List[Dict], stories: List[Dict], tasks: List[Dict]) -> bytes:
    """
    Export sprint plan to CSV format
    """
    # Create a comprehensive CSV with all data
    rows = []
    
    # Add summary row
    rows.append({
        'Type': 'Summary',
        'Name': 'Sprint Plan Summary',
        'Epics': sprint_plan.get('epics', 0),
        'Stories': sprint_plan.get('stories', 0),
        'Tasks': sprint_plan.get('tasks', 0),
        'Total Effort': sprint_plan.get('total_effort', 0),
        'Predicted Velocity': sprint_plan.get('predicted_velocity', 0),
        'Estimated Sprints': sprint_plan.get('estimated_sprints', 0),
    })
    
    # Add epics
    for epic in epics:
        rows.append({
            'Type': 'Epic',
            'Name': epic.get('title', ''),
            'Description': epic.get('description', ''),
            'Priority': epic.get('priority', ''),
            'Estimated Effort': epic.get('estimated_effort', 0),
        })
    
    # Add stories
    for story in stories:
        rows.append({
            'Type': 'Story',
            'Name': story.get('title', ''),
            'Description': story.get('description', ''),
            'Acceptance Criteria': story.get('acceptance_criteria', ''),
            'Priority': story.get('priority', ''),
            'Estimated Effort': story.get('estimated_effort', 0),
        })
    
    # Add tasks
    for task in tasks:
        rows.append({
            'Type': 'Task',
            'Name': task.get('title', ''),
            'Description': task.get('description', ''),
            'Status': task.get('status', ''),
            'Priority': task.get('priority', ''),
            'Estimated Hours': task.get('estimated_hours', 0),
        })
    
    # Convert to DataFrame and then to CSV
    df = pd.DataFrame(rows)
    buffer = io.BytesIO()
    df.to_csv(buffer, index=False)
    buffer.seek(0)
    return buffer.getvalue()

def format_for_jira(sprint_plan: Dict[str, Any], epics: List[Dict], stories: List[Dict], tasks: List[Dict]) -> str:
    """
    Format sprint plan for JIRA import (CSV format compatible with JIRA)
    """
    jira_rows = []
    
    # Add epics
    for epic in epics:
        jira_rows.append({
            'Issue Type': 'Epic',
            'Summary': epic.get('title', ''),
            'Description': epic.get('description', ''),
            'Priority': epic.get('priority', '').upper(),
            'Story Points': epic.get('estimated_effort', 0),
        })
    
    # Add stories
    for story in stories:
        jira_rows.append({
            'Issue Type': 'Story',
            'Summary': story.get('title', ''),
            'Description': story.get('description', ''),
            'Acceptance Criteria': story.get('acceptance_criteria', ''),
            'Priority': story.get('priority', '').upper(),
            'Story Points': story.get('estimated_effort', 0),
        })
    
    # Add tasks
    for task in tasks:
        jira_rows.append({
            'Issue Type': 'Task',
            'Summary': task.get('title', ''),
            'Description': task.get('description', ''),
            'Status': task.get('status', '').upper().replace('_', ' '),
            'Priority': task.get('priority', '').upper(),
            'Time Estimate': f"{task.get('estimated_hours', 0)}h",
        })
    
    df = pd.DataFrame(jira_rows)
    buffer = io.BytesIO()
    df.to_csv(buffer, index=False)
    buffer.seek(0)
    return buffer.getvalue().decode('utf-8')

